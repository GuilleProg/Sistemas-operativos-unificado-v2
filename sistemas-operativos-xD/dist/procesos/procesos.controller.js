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
exports.ProcesosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const procesos_service_1 = require("./procesos.service");
const create_proceso_dto_1 = require("./dto/create-proceso.dto");
const proceso_entity_1 = require("./entities/proceso.entity");
let ProcesosController = class ProcesosController {
    procesosService;
    constructor(procesosService) {
        this.procesosService = procesosService;
    }
    create(createProcesoDto) {
        return this.procesosService.create(createProcesoDto);
    }
    findAll() {
        return this.procesosService.findAll();
    }
    findOne(id) {
        return this.procesosService.findOne(id);
    }
    remove(id) {
        return this.procesosService.remove(id);
    }
    removeAll() {
        return this.procesosService.removeAll();
    }
};
exports.ProcesosController = ProcesosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo proceso' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: proceso_entity_1.Proceso }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_proceso_dto_1.CreateProcesoDto]),
    __metadata("design:returntype", void 0)
], ProcesosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los procesos' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [proceso_entity_1.Proceso] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcesosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un proceso por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: proceso_entity_1.Proceso }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProcesosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un proceso por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProcesosController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar todos los procesos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcesosController.prototype, "removeAll", null);
exports.ProcesosController = ProcesosController = __decorate([
    (0, swagger_1.ApiTags)('Procesos'),
    (0, common_1.Controller)('procesos'),
    __metadata("design:paramtypes", [procesos_service_1.ProcesosService])
], ProcesosController);
//# sourceMappingURL=procesos.controller.js.map