"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const procesos_module_1 = require("./procesos/procesos.module");
const planificador_module_1 = require("./planificador/planificador.module");
const simulaciones_module_1 = require("./simulaciones/simulaciones.module");
const websocket_module_1 = require("./websocket/websocket.module");
const proceso_entity_1 = require("./procesos/entities/proceso.entity");
const simulacion_entity_1 = require("./simulaciones/entities/simulacion.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'gj28752317',
                database: process.env.DB_NAME || 'ms_cpu',
                entities: [proceso_entity_1.Proceso, simulacion_entity_1.Simulacion],
                synchronize: true,
            }),
            procesos_module_1.ProcesosModule,
            planificador_module_1.PlanificadorModule,
            simulaciones_module_1.SimulacionesModule,
            websocket_module_1.WebsocketModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map