import { Proceso } from '../procesos/entities/proceso.entity';
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
    estados: {
        tiempo: number;
        procesos: {
            id: number;
            burstRestante?: number;
            estado: string;
        }[];
    }[];
}
export declare class PlanificadorService {
    private clonarProcesos;
    private generarSnapshot;
    private aplicarIO;
    ejecutarFCFS(procesos: Proceso[]): ResultadoSimulacion;
    ejecutarSJF(procesos: Proceso[]): ResultadoSimulacion;
    ejecutarSRTF(procesos: Proceso[]): ResultadoSimulacion;
    ejecutarRoundRobin(procesos: Proceso[], quantum: number): ResultadoSimulacion;
    ejecutarPrioridad(procesos: Proceso[]): ResultadoSimulacion;
    simular(procesos: Proceso[], algoritmo: string, quantum?: number): ResultadoSimulacion;
}
