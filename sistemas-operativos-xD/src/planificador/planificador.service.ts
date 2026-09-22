import { Injectable, BadRequestException } from '@nestjs/common';
import { Proceso, EstadoProceso } from '../procesos/entities/proceso.entity';

export interface GanttEntry {
  procesoId: number;
  procesoNombre: string;
  inicio: number;
  fin: number;
  tipo: 'cpu' | 'io';
}

export interface ResultadoSimulacion {
  algoritmo: string;
  quantum?: number;
  gantt: GanttEntry[];
  tiempoEsperaPromedio: number;
  tiempoRetornoPromedio: number;
  metricasPorProceso: {
    procesoId: number;
    procesoNombre: string;
    tiempoLlegada: number;
    tiempoRafaga: number;
    tiempoIO: number;
    tiempoInicio: number;
    tiempoFinal: number;
    tiempoRetorno: number;
    tiempoEspera: number;
  }[];
  estados: { tiempo: number; procesos: { id: number; burstRestante?: number; estado: string }[] }[];
}

@Injectable()
export class PlanificadorService {
  private clonarProcesos(procesos: Proceso[]) {
    return procesos.map((p) => ({ ...p }));
  }

  private generarSnapshot(
    tiempo: number,
    estados: { id: number; burstRestante?: number; estado: EstadoProceso }[],
  ) {
    return {
      tiempo,
      procesos: estados.map((p) => ({
        id: p.id,
        burstRestante: p.burstRestante ?? undefined,
        estado: p.estado,
      })),
    };
  }

  // ─── helper: bloqueo por I/O ────────────────────────────────────────────
  private aplicarIO(
    p: Proceso & { burstRestante?: number },
    tiempoInicioIO: number,
    gantt: GanttEntry[],
    estados: ResultadoSimulacion['estados'],
    copias: (Proceso & { burstRestante?: number })[],
  ): number {
    if (p.ioTime <= 0) return tiempoInicioIO;

    const finIO = tiempoInicioIO + p.ioTime;
    gantt.push({
      procesoId: p.id,
      procesoNombre: p.nombre,
      inicio: tiempoInicioIO,
      fin: finIO,
      tipo: 'io',
    });
    estados.push({
      tiempo: finIO,
      procesos: copias.map((cp) => ({
        id: cp.id,
        burstRestante: cp.burstRestante,
        estado: cp.burstRestante && cp.burstRestante > 0
          ? EstadoProceso.LISTO
          : cp.id === p.id
            ? EstadoProceso.BLOQUEADO
            : EstadoProceso.TERMINADO,
      })),
    });
    return finIO;
  }

  // ─── FCFS ────────────────────────────────────────────────────────────────
  ejecutarFCFS(procesos: Proceso[]): ResultadoSimulacion {
    const copias = this.clonarProcesos(procesos).sort(
      (a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id,
    );
    const gantt: GanttEntry[] = [];
    const metricasPorProceso: ResultadoSimulacion['metricasPorProceso'] = [];
    let tiempoActual = 0;
    const estados = [this.generarSnapshot(0, copias.map((p) => ({ ...p, estado: EstadoProceso.LISTO })))];

    for (const p of copias) {
      if (tiempoActual < p.arrivalTime) tiempoActual = p.arrivalTime;

      const inicioCPU = tiempoActual;
      const finCPU = inicioCPU + p.burstTime;
      gantt.push({ procesoId: p.id, procesoNombre: p.nombre, inicio: inicioCPU, fin: finCPU, tipo: 'cpu' });
      estados.push(this.generarSnapshot(finCPU, copias.map((cp) => ({
        ...cp,
        estado: cp.id === p.id ? EstadoProceso.EJECUTANDO : EstadoProceso.LISTO,
      }))));

      tiempoActual = finCPU;
      const finIO = this.aplicarIO(p, tiempoActual, gantt, estados, copias);
      const finTotal = finIO;

      metricasPorProceso.push({
        procesoId: p.id,
        procesoNombre: p.nombre,
        tiempoLlegada: p.arrivalTime,
        tiempoRafaga: p.burstTime,
        tiempoIO: p.ioTime,
        tiempoInicio: inicioCPU,
        tiempoFinal: finTotal,
        tiempoRetorno: finTotal - p.arrivalTime,
        tiempoEspera: inicioCPU - p.arrivalTime,
      });
      tiempoActual = finTotal;

      estados.push(this.generarSnapshot(finTotal, copias.map((cp) => ({
        ...cp,
        estado: cp.id === p.id ? EstadoProceso.TERMINADO : EstadoProceso.LISTO,
      }))));
    }

    const n = metricasPorProceso.length;
    return {
      algoritmo: 'FCFS',
      gantt,
      tiempoEsperaPromedio: metricasPorProceso.reduce((s, m) => s + m.tiempoEspera, 0) / n,
      tiempoRetornoPromedio: metricasPorProceso.reduce((s, m) => s + m.tiempoRetorno, 0) / n,
      metricasPorProceso,
      estados,
    };
  }

  // ─── SJF (no apropiativo) ────────────────────────────────────────────────
  ejecutarSJF(procesos: Proceso[]): ResultadoSimulacion {
    const copias = this.clonarProcesos(procesos);
    const gantt: GanttEntry[] = [];
    let tiempoActual = 0;
    const estados: ResultadoSimulacion['estados'] = [];
    const metricasPorProceso: ResultadoSimulacion['metricasPorProceso'] = [];
    const pendientes = [...copias];

    while (pendientes.length > 0) {
      const disponibles = pendientes.filter((p) => p.arrivalTime <= tiempoActual);
      if (disponibles.length === 0) {
        tiempoActual = Math.min(...pendientes.map((p) => p.arrivalTime));
        continue;
      }
      disponibles.sort((a, b) => a.burstTime - b.burstTime || a.id - b.id);
      const p = disponibles[0];
      const idx = pendientes.indexOf(p);
      pendientes.splice(idx, 1);

      const inicioCPU = tiempoActual;
      const finCPU = inicioCPU + p.burstTime;
      gantt.push({ procesoId: p.id, procesoNombre: p.nombre, inicio: inicioCPU, fin: finCPU, tipo: 'cpu' });
      estados.push(this.generarSnapshot(finCPU, copias.map((cp) => ({
        ...cp,
        estado: cp.id === p.id ? EstadoProceso.EJECUTANDO : pendientes.includes(cp) ? EstadoProceso.LISTO : EstadoProceso.TERMINADO,
      }))));

      tiempoActual = finCPU;
      const finIO = this.aplicarIO(p, tiempoActual, gantt, estados, copias);
      const finTotal = finIO;

      metricasPorProceso.push({
        procesoId: p.id,
        procesoNombre: p.nombre,
        tiempoLlegada: p.arrivalTime,
        tiempoRafaga: p.burstTime,
        tiempoIO: p.ioTime,
        tiempoInicio: inicioCPU,
        tiempoFinal: finTotal,
        tiempoRetorno: finTotal - p.arrivalTime,
        tiempoEspera: inicioCPU - p.arrivalTime,
      });
      tiempoActual = finTotal;
    }

    const n = metricasPorProceso.length;
    return {
      algoritmo: 'SJF',
      gantt,
      tiempoEsperaPromedio: metricasPorProceso.reduce((s, m) => s + m.tiempoEspera, 0) / n,
      tiempoRetornoPromedio: metricasPorProceso.reduce((s, m) => s + m.tiempoRetorno, 0) / n,
      metricasPorProceso,
      estados,
    };
  }

  // ─── SRTF (SJF apropiativo) ──────────────────────────────────────────────
  ejecutarSRTF(procesos: Proceso[]): ResultadoSimulacion {
    const copias = this.clonarProcesos(procesos).map((p) => ({ ...p, burstRestante: p.burstTime }));
    const gantt: GanttEntry[] = [];
    let tiempoActual = 0;
    let completados = 0;
    const n = copias.length;
    const metricasMap = new Map<number, any>();
    const estados: ResultadoSimulacion['estados'] = [];
    let ultimoProceso: number | null = null;
    let inicioFragmento = 0;

    copias.forEach((p) =>
      metricasMap.set(p.id, {
        procesoId: p.id,
        procesoNombre: p.nombre,
        tiempoLlegada: p.arrivalTime,
        tiempoRafaga: p.burstTime,
        tiempoIO: p.ioTime,
        tiempoInicio: -1,
        tiempoFinal: 0,
        tiempoRetorno: 0,
        tiempoEspera: 0,
      }),
    );

    while (completados < n) {
      const disponibles = copias.filter((p) => p.arrivalTime <= tiempoActual && p.burstRestante > 0);
      if (disponibles.length === 0) {
        tiempoActual++;
        continue;
      }
      disponibles.sort((a, b) => a.burstRestante - b.burstRestante || a.id - b.id);
      const p = disponibles[0];

      if (ultimoProceso !== p.id) {
        if (ultimoProceso !== null) {
          gantt.push({
            procesoId: ultimoProceso,
            procesoNombre: copias.find((c) => c.id === ultimoProceso)!.nombre,
            inicio: inicioFragmento,
            fin: tiempoActual,
            tipo: 'cpu',
          });
        }
        const m = metricasMap.get(p.id);
        if (m.tiempoInicio === -1) m.tiempoInicio = tiempoActual;
        ultimoProceso = p.id;
        inicioFragmento = tiempoActual;
      }

      p.burstRestante--;
      tiempoActual++;

      if (p.burstRestante === 0) {
        gantt.push({
          procesoId: p.id,
          procesoNombre: p.nombre,
          inicio: inicioFragmento,
          fin: tiempoActual,
          tipo: 'cpu',
        });
        const m = metricasMap.get(p.id);
        let finTotal = tiempoActual;

        if (p.ioTime > 0) {
          const finIO = tiempoActual + p.ioTime;
          gantt.push({
            procesoId: p.id,
            procesoNombre: p.nombre,
            inicio: tiempoActual,
            fin: finIO,
            tipo: 'io',
          });
          finTotal = finIO;
          estados.push({
            tiempo: finIO,
            procesos: copias.map((cp) => ({
              id: cp.id,
              burstRestante: cp.burstRestante,
              estado: cp.burstRestante && cp.burstRestante > 0 ? EstadoProceso.LISTO : cp.id === p.id ? EstadoProceso.BLOQUEADO : EstadoProceso.TERMINADO,
            })),
          });
          tiempoActual = finIO;
        }

        m.tiempoFinal = finTotal;
        m.tiempoRetorno = finTotal - m.tiempoLlegada;
        m.tiempoEspera = m.tiempoRetorno - m.tiempoRafaga - p.ioTime;
        completados++;
        ultimoProceso = null;

        estados.push(this.generarSnapshot(finTotal, copias.map((cp) => ({
          ...cp,
          estado: cp.burstRestante && cp.burstRestante > 0 ? EstadoProceso.LISTO : EstadoProceso.TERMINADO,
        }))));
      }
    }

    const metricasPorProceso = Array.from(metricasMap.values());
    const totalEspera = metricasPorProceso.reduce((s, m) => s + m.tiempoEspera, 0);
    const totalRetorno = metricasPorProceso.reduce((s, m) => s + m.tiempoRetorno, 0);
    return {
      algoritmo: 'SRTF',
      gantt,
      tiempoEsperaPromedio: totalEspera / n,
      tiempoRetornoPromedio: totalRetorno / n,
      metricasPorProceso,
      estados,
    };
  }

  // ─── Round Robin ─────────────────────────────────────────────────────────
  ejecutarRoundRobin(procesos: Proceso[], quantum: number): ResultadoSimulacion {
    const copias = this.clonarProcesos(procesos).map((p) => ({ ...p, burstRestante: p.burstTime }));
    const gantt: GanttEntry[] = [];
    let tiempoActual = 0;
    let completados = 0;
    const n = copias.length;
    const metricasMap = new Map<number, any>();
    const estados: ResultadoSimulacion['estados'] = [];
    const cola: (typeof copias[0])[] = [];
    let enCPU: (typeof copias[0]) | null = null;
    let tiempoQuantum = 0;

    copias.forEach((p) =>
      metricasMap.set(p.id, {
        procesoId: p.id,
        procesoNombre: p.nombre,
        tiempoLlegada: p.arrivalTime,
        tiempoRafaga: p.burstTime,
        tiempoIO: p.ioTime,
        tiempoInicio: -1,
        tiempoFinal: 0,
        tiempoRetorno: 0,
        tiempoEspera: 0,
      }),
    );

    const llegan = (t: number) => {
      copias.forEach((p) => {
        if (p.arrivalTime === t && p.burstRestante > 0 && !cola.includes(p) && enCPU !== p) {
          cola.push(p);
        }
      });
    };

    while (completados < n) {
      llegan(tiempoActual);

      if (enCPU === null && cola.length > 0) {
        enCPU = cola.shift()!;
        tiempoQuantum = 0;
        const m = metricasMap.get(enCPU.id)!;
        if (m.tiempoInicio === -1) m.tiempoInicio = tiempoActual;
      }

      if (enCPU !== null) {
        enCPU.burstRestante--;
        tiempoQuantum++;

        estados.push({
          tiempo: tiempoActual + 1,
          procesos: copias.map((cp) => ({
            id: cp.id,
            burstRestante: cp.burstRestante,
            estado: cp.burstRestante <= 0 ? EstadoProceso.TERMINADO : cp.id === enCPU!.id ? EstadoProceso.EJECUTANDO : EstadoProceso.LISTO,
          })),
        });

        if (enCPU.burstRestante === 0) {
          gantt.push({
            procesoId: enCPU.id,
            procesoNombre: enCPU.nombre,
            inicio: tiempoActual - tiempoQuantum + 1,
            fin: tiempoActual + 1,
            tipo: 'cpu',
          });
          const m = metricasMap.get(enCPU.id)!;
          let finTotal = tiempoActual + 1;

          if (enCPU.ioTime > 0) {
            const finIO = finTotal + enCPU.ioTime;
            gantt.push({
              procesoId: enCPU.id,
              procesoNombre: enCPU.nombre,
              inicio: finTotal,
              fin: finIO,
              tipo: 'io',
            });
            finTotal = finIO;
            for (let t = tiempoActual + 2; t <= finIO; t++) {
              estados.push({
                tiempo: t,
                procesos: copias.map((cp) => ({
                  id: cp.id,
                  burstRestante: cp.burstRestante,
                  estado: cp.burstRestante && cp.burstRestante > 0 ? EstadoProceso.LISTO : cp.id === enCPU!.id ? EstadoProceso.BLOQUEADO : EstadoProceso.TERMINADO,
                })),
              });
            }
            tiempoActual = finIO;
          } else {
            tiempoActual++;
          }

          m.tiempoFinal = finTotal;
          m.tiempoRetorno = finTotal - m.tiempoLlegada;
          m.tiempoEspera = m.tiempoRetorno - m.tiempoRafaga - enCPU.ioTime;
          completados++;
          enCPU = null;
          tiempoQuantum = 0;
        } else if (tiempoQuantum >= quantum) {
          gantt.push({
            procesoId: enCPU.id,
            procesoNombre: enCPU.nombre,
            inicio: tiempoActual - quantum + 1,
            fin: tiempoActual + 1,
            tipo: 'cpu',
          });
          cola.push(enCPU);
          enCPU = null;
          tiempoQuantum = 0;
          tiempoActual++;
        } else {
          tiempoActual++;
        }
      } else {
        tiempoActual++;
      }
    }

    const metricasPorProceso = Array.from(metricasMap.values());
    const totalEspera = metricasPorProceso.reduce((s, m) => s + m.tiempoEspera, 0);
    const totalRetorno = metricasPorProceso.reduce((s, m) => s + m.tiempoRetorno, 0);
    return {
      algoritmo: 'Round Robin',
      quantum,
      gantt,
      tiempoEsperaPromedio: totalEspera / n,
      tiempoRetornoPromedio: totalRetorno / n,
      metricasPorProceso,
      estados,
    };
  }

  // ─── Prioridad (no apropiativo) ──────────────────────────────────────────
  ejecutarPrioridad(procesos: Proceso[]): ResultadoSimulacion {
    const copias = this.clonarProcesos(procesos);
    const gantt: GanttEntry[] = [];
    let tiempoActual = 0;
    const estados: ResultadoSimulacion['estados'] = [];
    const metricasPorProceso: ResultadoSimulacion['metricasPorProceso'] = [];
    const pendientes = [...copias];

    while (pendientes.length > 0) {
      const disponibles = pendientes.filter((p) => p.arrivalTime <= tiempoActual);
      if (disponibles.length === 0) {
        tiempoActual = Math.min(...pendientes.map((p) => p.arrivalTime));
        continue;
      }
      disponibles.sort((a, b) => a.prioridad - b.prioridad || a.id - b.id);
      const p = disponibles[0];
      const idx = pendientes.indexOf(p);
      pendientes.splice(idx, 1);

      const inicioCPU = tiempoActual;
      const finCPU = inicioCPU + p.burstTime;
      gantt.push({ procesoId: p.id, procesoNombre: p.nombre, inicio: inicioCPU, fin: finCPU, tipo: 'cpu' });
      estados.push(this.generarSnapshot(finCPU, copias.map((cp) => ({
        ...cp,
        estado: cp.id === p.id ? EstadoProceso.EJECUTANDO : pendientes.includes(cp) ? EstadoProceso.LISTO : EstadoProceso.TERMINADO,
      }))));

      tiempoActual = finCPU;
      const finIO = this.aplicarIO(p, tiempoActual, gantt, estados, copias);
      const finTotal = finIO;

      metricasPorProceso.push({
        procesoId: p.id,
        procesoNombre: p.nombre,
        tiempoLlegada: p.arrivalTime,
        tiempoRafaga: p.burstTime,
        tiempoIO: p.ioTime,
        tiempoInicio: inicioCPU,
        tiempoFinal: finTotal,
        tiempoRetorno: finTotal - p.arrivalTime,
        tiempoEspera: inicioCPU - p.arrivalTime,
      });
      tiempoActual = finTotal;
    }

    const n = metricasPorProceso.length;
    return {
      algoritmo: 'Prioridad',
      gantt,
      tiempoEsperaPromedio: metricasPorProceso.reduce((s, m) => s + m.tiempoEspera, 0) / n,
      tiempoRetornoPromedio: metricasPorProceso.reduce((s, m) => s + m.tiempoRetorno, 0) / n,
      metricasPorProceso,
      estados,
    };
  }

  // ─── Orquestador ─────────────────────────────────────────────────────────
  simular(
    procesos: Proceso[],
    algoritmo: string,
    quantum?: number,
  ): ResultadoSimulacion {
    if (!procesos || procesos.length === 0) {
      throw new BadRequestException('No hay procesos para simular');
    }

    switch (algoritmo.toLowerCase()) {
      case 'fcfs':
        return this.ejecutarFCFS(procesos);
      case 'sjf':
        return this.ejecutarSJF(procesos);
      case 'srtf':
        return this.ejecutarSRTF(procesos);
      case 'rr':
        if (!quantum || quantum < 1)
          throw new BadRequestException('Round Robin requiere quantum >= 1');
        return this.ejecutarRoundRobin(procesos, quantum);
      case 'prioridad':
        return this.ejecutarPrioridad(procesos);
      default:
        throw new BadRequestException(
          `Algoritmo "${algoritmo}" no válido. Opciones: fcfs, sjf, srtf, rr, prioridad`,
        );
    }
  }
}
