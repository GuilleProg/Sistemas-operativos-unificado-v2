"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebsocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const procesos_service_1 = require("../procesos/procesos.service");
const planificador_service_1 = require("../planificador/planificador.service");
const simulaciones_service_1 = require("../simulaciones/simulaciones.service");
const ws_eventos_dto_1 = require("./dto/ws-eventos.dto");
let WebsocketGateway = WebsocketGateway_1 = class WebsocketGateway {
    procesosService;
    planificadorService;
    simulacionesService;
    logger = new common_1.Logger(WebsocketGateway_1.name);
    server;
    constructor(procesosService, planificadorService, simulacionesService) {
        this.procesosService = procesosService;
        this.planificadorService = planificadorService;
        this.simulacionesService = simulacionesService;
    }
    handleConnection(client) {
        this.logger.log(`Cliente conectado: ${client.id}`);
        client.emit('conectado', ws_eventos_dto_1.WSResponse.ok('conectado', { clientId: client.id }));
    }
    handleDisconnect(client) {
        this.logger.log(`Cliente desconectado: ${client.id}`);
    }
    async emitirProcesos() {
        const procesos = await this.procesosService.findAll();
        this.server.emit('procesos:actualizados', ws_eventos_dto_1.WSResponse.ok('procesos:actualizados', procesos));
    }
    async onCreate(client, dto) {
        try {
            if (!dto.nombre || !dto.burstTime) {
                client.emit('procesos:crear', ws_eventos_dto_1.WSResponse.fail('procesos:crear', 'nombre y burstTime son requeridos'));
                return;
            }
            const proceso = await this.procesosService.create({
                nombre: dto.nombre,
                burstTime: dto.burstTime,
                arrivalTime: dto.arrivalTime ?? 0,
                prioridad: dto.prioridad ?? 1,
                ioTime: dto.ioTime ?? 0,
            });
            client.emit('procesos:crear', ws_eventos_dto_1.WSResponse.ok('procesos:crear', proceso));
            await this.emitirProcesos();
        }
        catch (e) {
            client.emit('procesos:crear', ws_eventos_dto_1.WSResponse.fail('procesos:crear', e.message));
        }
    }
    async onList(client) {
        try {
            const procesos = await this.procesosService.findAll();
            client.emit('procesos:listar', ws_eventos_dto_1.WSResponse.ok('procesos:listar', procesos));
        }
        catch (e) {
            client.emit('procesos:listar', ws_eventos_dto_1.WSResponse.fail('procesos:listar', e.message));
        }
    }
    async onDelete(client, dto) {
        try {
            await this.procesosService.remove(dto.id);
            client.emit('procesos:eliminar', ws_eventos_dto_1.WSResponse.ok('procesos:eliminar', { id: dto.id }));
            await this.emitirProcesos();
        }
        catch (e) {
            client.emit('procesos:eliminar', ws_eventos_dto_1.WSResponse.fail('procesos:eliminar', e.message));
        }
    }
    async onDeleteAll(client) {
        try {
            await this.procesosService.removeAll();
            client.emit('procesos:eliminar-todos', ws_eventos_dto_1.WSResponse.ok('procesos:eliminar-todos', null));
            await this.emitirProcesos();
        }
        catch (e) {
            client.emit('procesos:eliminar-todos', ws_eventos_dto_1.WSResponse.fail('procesos:eliminar-todos', e.message));
        }
    }
    async onSimular(client, dto) {
        try {
            const procesos = await this.procesosService.findAll();
            if (!procesos.length) {
                client.emit('simulacion:completada', ws_eventos_dto_1.WSResponse.fail('simulacion:completada', 'No hay procesos para simular'));
                return;
            }
            const resultado = this.planificadorService.simular(procesos, dto.algoritmo, dto.quantum);
            const simulacion = await this.simulacionesService.create({
                algoritmo: resultado.algoritmo,
                quantum: resultado.quantum,
                resultado: resultado,
            });
            const payload = { id: simulacion.id, ...resultado };
            client.emit('simulacion:completada', ws_eventos_dto_1.WSResponse.ok('simulacion:completada', payload));
            this.server.emit('simulacion:nueva', ws_eventos_dto_1.WSResponse.ok('simulacion:nueva', {
                id: simulacion.id,
                algoritmo: resultado.algoritmo,
                quantum: resultado.quantum,
                createdAt: simulacion.createdAt,
            }));
        }
        catch (e) {
            client.emit('simulacion:completada', ws_eventos_dto_1.WSResponse.fail('simulacion:completada', e.message));
        }
    }
    async onSimularPasoAPaso(client, dto) {
        try {
            const procesos = await this.procesosService.findAll();
            if (!procesos.length) {
                client.emit('simulacion:paso', ws_eventos_dto_1.WSResponse.fail('simulacion:paso', 'No hay procesos para simular'));
                return;
            }
            const resultado = this.planificadorService.simular(procesos, dto.algoritmo, dto.quantum);
            const simulacion = await this.simulacionesService.create({
                algoritmo: resultado.algoritmo,
                quantum: resultado.quantum,
                resultado: resultado,
            });
            for (let i = 0; i < resultado.estados.length; i++) {
                const estado = resultado.estados[i];
                const ganttParcial = resultado.gantt.filter((g) => g.fin <= estado.tiempo);
                client.emit('simulacion:paso', ws_eventos_dto_1.WSResponse.ok('simulacion:paso', {
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
            client.emit('simulacion:paso-fin', ws_eventos_dto_1.WSResponse.ok('simulacion:paso-fin', {
                id: simulacion.id,
                ...resultado,
            }));
        }
        catch (e) {
            client.emit('simulacion:paso', ws_eventos_dto_1.WSResponse.fail('simulacion:paso', e.message));
        }
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('procesos:crear'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, ws_eventos_dto_1.WSCrearProcesoDto]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "onCreate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('procesos:listar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "onList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('procesos:eliminar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, ws_eventos_dto_1.WSEliminarProcesoDto]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "onDelete", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('procesos:eliminar-todos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "onDeleteAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('simulacion:ejecutar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, ws_eventos_dto_1.WSSimularDto]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "onSimular", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('simulacion:paso-a-paso'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, ws_eventos_dto_1.WSSimularDto]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "onSimularPasoAPaso", null);
exports.WebsocketGateway = WebsocketGateway = WebsocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', methods: ['GET', 'POST'] },
        namespace: '/ws',
    }),
    __metadata("design:paramtypes", [procesos_service_1.ProcesosService,
        planificador_service_1.PlanificadorService,
        simulaciones_service_1.SimulacionesService])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map