"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulacionesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const simulacion_entity_1 = require("./entities/simulacion.entity");
const simulaciones_service_1 = require("./simulaciones.service");
const simulaciones_controller_1 = require("./simulaciones.controller");
let SimulacionesModule = class SimulacionesModule {
};
exports.SimulacionesModule = SimulacionesModule;
exports.SimulacionesModule = SimulacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([simulacion_entity_1.Simulacion])],
        controllers: [simulaciones_controller_1.SimulacionesController],
        providers: [simulaciones_service_1.SimulacionesService],
        exports: [simulaciones_service_1.SimulacionesService],
    })
], SimulacionesModule);
//# sourceMappingURL=simulaciones.module.js.map