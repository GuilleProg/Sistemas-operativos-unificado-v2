"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanificadorModule = void 0;
const common_1 = require("@nestjs/common");
const procesos_module_1 = require("../procesos/procesos.module");
const simulaciones_module_1 = require("../simulaciones/simulaciones.module");
const planificador_controller_1 = require("./planificador.controller");
const planificador_service_1 = require("./planificador.service");
let PlanificadorModule = class PlanificadorModule {
};
exports.PlanificadorModule = PlanificadorModule;
exports.PlanificadorModule = PlanificadorModule = __decorate([
    (0, common_1.Module)({
        imports: [procesos_module_1.ProcesosModule, simulaciones_module_1.SimulacionesModule],
        controllers: [planificador_controller_1.PlanificadorController],
        providers: [planificador_service_1.PlanificadorService],
        exports: [planificador_service_1.PlanificadorService],
    })
], PlanificadorModule);
//# sourceMappingURL=planificador.module.js.map