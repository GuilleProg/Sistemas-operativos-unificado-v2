import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProcesosService } from '../procesos/procesos.service';
import { PlanificadorService } from '../planificador/planificador.service';
import { SimulacionesService } from '../simulaciones/simulaciones.service';
import { WSCrearProcesoDto, WSEliminarProcesoDto, WSSimularDto } from './dto/ws-eventos.dto';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly procesosService;
    private readonly planificadorService;
    private readonly simulacionesService;
    private readonly logger;
    server: Server;
    constructor(procesosService: ProcesosService, planificadorService: PlanificadorService, simulacionesService: SimulacionesService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private emitirProcesos;
    onCreate(client: Socket, dto: WSCrearProcesoDto): Promise<void>;
    onList(client: Socket): Promise<void>;
    onDelete(client: Socket, dto: WSEliminarProcesoDto): Promise<void>;
    onDeleteAll(client: Socket): Promise<void>;
    onSimular(client: Socket, dto: WSSimularDto): Promise<void>;
    onSimularPasoAPaso(client: Socket, dto: WSSimularDto): Promise<void>;
    private delay;
}
