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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proceso = exports.EstadoProceso = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var EstadoProceso;
(function (EstadoProceso) {
    EstadoProceso["NUEVO"] = "nuevo";
    EstadoProceso["LISTO"] = "listo";
    EstadoProceso["EJECUTANDO"] = "ejecutando";
    EstadoProceso["BLOQUEADO"] = "bloqueado";
    EstadoProceso["TERMINADO"] = "terminado";
})(EstadoProceso || (exports.EstadoProceso = EstadoProceso = {}));
let Proceso = class Proceso {
    id;
    nombre;
    burstTime;
    arrivalTime;
    prioridad;
    ioTime;
    estado;
};
exports.Proceso = Proceso;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Proceso.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Proceso A' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Proceso.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Proceso.prototype, "burstTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Proceso.prototype, "arrivalTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Proceso.prototype, "prioridad", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4, description: 'Tiempo de E/S (bloqueado) después del CPU burst. 0 = sin bloqueo' }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Proceso.prototype, "ioTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EstadoProceso, example: EstadoProceso.NUEVO }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoProceso,
        default: EstadoProceso.NUEVO,
    }),
    __metadata("design:type", String)
], Proceso.prototype, "estado", void 0);
exports.Proceso = Proceso = __decorate([
    (0, typeorm_1.Entity)()
], Proceso);
//# sourceMappingURL=proceso.entity.js.map