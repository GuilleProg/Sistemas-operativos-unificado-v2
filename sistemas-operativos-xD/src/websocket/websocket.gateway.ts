import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ProcesosService } from '../procesos/procesos.service';
import { PlanificadorService } from '../planificador/planificador.service';
import { SimulacionesService } from '../simulaciones/simulaciones.service';
import {
  WSCrearProcesoDto,
  WSEliminarProcesoDto,
  WSSimularDto,
  WSResponse,
} from './dto/ws-eventos.dto';

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'] },
  namespace: '/ws',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly procesosService: ProcesosService,
    private readonly planificadorService: PlanificadorService,
    private readonly simulacionesService: SimulacionesService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    client.emit('conectado', WSResponse.ok('conectado', { clientId: client.id }));
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // ── Emisores ──────────────────────────────────────────────────────────────
  private async emitirProcesos() {
    const procesos = await this.procesosService.findAll();
    this.server.emit('procesos:actualizados', WSResponse.ok('procesos:actualizados', procesos));
  }

  // ── Procesos: Crear ────────────────────────────────────────────────────────
  @SubscribeMessage('procesos:crear')
  async onCreate(client: Socket, dto: WSCrearProcesoDto) {
    try {
      if (!dto.nombre || !dto.burstTime) {
        client.emit('procesos:crear', WSResponse.fail('procesos:crear', 'nombre y burstTime son requeridos'));
        return;
      }
      const proceso = await this.procesosService.create({
        nombre: dto.nombre,
        burstTime: dto.burstTime,
        arrivalTime: dto.arrivalTime ?? 0,
        prioridad: dto.prioridad ?? 1,
        ioTime: dto.ioTime ?? 0,
      });
      client.emit('procesos:crear', WSResponse.ok('procesos:crear', proceso));
      await this.emitirProcesos();
    } catch (e: any) {
      client.emit('procesos:crear', WSResponse.fail('procesos:crear', e.message));
    }
  }

  // ── Procesos: Listar ───────────────────────────────────────────────────────
  @SubscribeMessage('procesos:listar')
  async onList(client: Socket) {
    try {
      const procesos = await this.procesosService.findAll();
      client.emit('procesos:listar', WSResponse.ok('procesos:listar', procesos));
    } catch (e: any) {
      client.emit('procesos:listar', WSResponse.fail('procesos:listar', e.message));
    }
  }

  // ── Procesos: Eliminar uno ────────────────────────────────────────────────
  @SubscribeMessage('procesos:eliminar')
  async onDelete(client: Socket, dto: WSEliminarProcesoDto) {
    try {
      await this.procesosService.remove(dto.id);
      client.emit('procesos:eliminar', WSResponse.ok('procesos:eliminar', { id: dto.id }));
      await this.emitirProcesos();
    } catch (e: any) {
      client.emit('procesos:eliminar', WSResponse.fail('procesos:eliminar', e.message));
    }
  }

  // ── Procesos: Eliminar todos ──────────────────────────────────────────────
  @SubscribeMessage('procesos:eliminar-todos')
  async onDeleteAll(client: Socket) {
    try {
      await this.procesosService.removeAll();
      client.emit('procesos:eliminar-todos', WSResponse.ok('procesos:eliminar-todos', null));
      await this.emitirProcesos();
    } catch (e: any) {
      client.emit('procesos:eliminar-todos', WSResponse.fail('procesos:eliminar-todos', e.message));
    }
  }

  // ── Simulación: Ejecutar ──────────────────────────────────────────────────
  @SubscribeMessage('simulacion:ejecutar')
  async onSimular(client: Socket, dto: WSSimularDto) {
    try {
      const procesos = await this.procesosService.findAll();
      if (!procesos.length) {
        client.emit('simulacion:completada', WSResponse.fail('simulacion:completada', 'No hay procesos para simular'));
        return;
      }
      const resultado = this.planificadorService.simular(procesos, dto.algoritmo, dto.quantum);

      const simulacion = await this.simulacionesService.create({
        algoritmo: resultado.algoritmo,
        quantum: resultado.quantum,
        resultado: resultado as object,
      });

      const payload = { id: simulacion.id, ...resultado };
      client.emit('simulacion:completada', WSResponse.ok('simulacion:completada', payload));
      this.server.emit('simulacion:nueva', WSResponse.ok('simulacion:nueva', {
        id: simulacion.id,
        algoritmo: resultado.algoritmo,
        quantum: resultado.quantum,
        createdAt: simulacion.createdAt,
      }));
    } catch (e: any) {
      client.emit('simulacion:completada', WSResponse.fail('simulacion:completada', e.message));
    }
  }

  // ── Simulación: Paso a paso ───────────────────────────────────────────────
  @SubscribeMessage('simulacion:paso-a-paso')
  async onSimularPasoAPaso(client: Socket, dto: WSSimularDto) {
    try {
      const procesos = await this.procesosService.findAll();
      if (!procesos.length) {
        client.emit('simulacion:paso', WSResponse.fail('simulacion:paso', 'No hay procesos para simular'));
        return;
      }

      const resultado = this.planificadorService.simular(procesos, dto.algoritmo, dto.quantum);

      const simulacion = await this.simulacionesService.create({
        algoritmo: resultado.algoritmo,
        quantum: resultado.quantum,
        resultado: resultado as object,
      });

      // Emitir cada paso del timeline con delay
      for (let i = 0; i < resultado.estados.length; i++) {
        const estado = resultado.estados[i];
        const ganttParcial = resultado.gantt.filter((g) => g.fin <= estado.tiempo);

        client.emit('simulacion:paso', WSResponse.ok('simulacion:paso', {
          paso: i + 1,
          totalPasos: resultado.estados.length,
          tiempo: estado.tiempo,
          procesos: estado.procesos,
          ganttParcial,
          ganttCompleto: resultado.gantt.filter((g) => g.inicio < estado.tiempo),
          metricaParcial: i === resultado.estados.length - 1 ? {
            tiempoEsperaPromedio: resultado.tiempoEsperaPromedio,
            tiempoRetornoPromedio: resultado.tiempoRetornoPromedio,
          } : null,
          id: simulacion.id,
        }));

        await this.delay(500);
      }

      client.emit('simulacion:paso-fin', WSResponse.ok('simulacion:paso-fin', {
        id: simulacion.id,
        ...resultado,
      }));
    } catch (e: any) {
      client.emit('simulacion:paso', WSResponse.fail('simulacion:paso', e.message));
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
