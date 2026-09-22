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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanificadorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const planificador_service_1 = require("./planificador.service");
const procesos_service_1 = require("../procesos/procesos.service");
const simulaciones_service_1 = require("../simulaciones/simulaciones.service");
let PlanificadorController = class PlanificadorController {
    planificadorService;
    procesosService;
    simulacionesService;
    constructor(planificadorService, procesosService, simulacionesService) {
        this.planificadorService = planificadorService;
        this.procesosService = procesosService;
        this.simulacionesService = simulacionesService;
    }
    async simular(algoritmo, quantum) {
        const procesos = await this.procesosService.findAll();
        const resultado = this.planificadorService.simular(procesos, algoritmo, quantum ? parseInt(quantum, 10) : undefined);
        const simulacion = await this.simulacionesService.create({
            algoritmo: resultado.algoritmo,
            quantum: resultado.quantum,
            resultado: resultado,
        });
        return {
            id: simulacion.id,
            ...resultado,
        };
    }
};
exports.PlanificadorController = PlanificadorController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ejecutar simulación con los procesos existentes' }),
    (0, swagger_1.ApiQuery)({ name: 'algoritmo', enum: ['fcfs', 'sjf', 'srtf', 'rr', 'prioridad'], description: 'Algoritmo de planificación' }),
    (0, swagger_1.ApiQuery)({ name: 'quantum', required: false, description: 'Quantum para Round Robin (requerido si algoritmo=rr)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resultado de la simulación con Gantt y métricas' }),
    __param(0, (0, common_1.Query)('algoritmo')),
    __param(1, (0, common_1.Query)('quantum')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlanificadorController.prototype, "simular", null);
exports.PlanificadorController = PlanificadorController = __decorate([
    (0, swagger_1.ApiTags)('Simulación'),
    (0, common_1.Controller)('simular'),
    __metadata("design:paramtypes", [planificador_service_1.PlanificadorService,
        procesos_service_1.ProcesosService,
        simulaciones_service_1.SimulacionesService])
], PlanificadorController);
//# sourceMappingURL=planificador.controller.js.map