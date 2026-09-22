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
exports.ProcesosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proceso_entity_1 = require("./entities/proceso.entity");
let ProcesosService = class ProcesosService {
    procesoRepository;
    constructor(procesoRepository) {
        this.procesoRepository = procesoRepository;
    }
    async create(createProcesoDto) {
        const proceso = this.procesoRepository.create({
            ...createProcesoDto,
            burstTime: createProcesoDto.burstTime,
            arrivalTime: createProcesoDto.arrivalTime ?? 0,
            prioridad: createProcesoDto.prioridad ?? 1,
            ioTime: createProcesoDto.ioTime ?? 0,
            estado: proceso_entity_1.EstadoProceso.NUEVO,
        });
        return this.procesoRepository.save(proceso);
    }
    async findAll() {
        return this.procesoRepository.find({ order: { id: 'ASC' } });
    }
    async findOne(id) {
        const proceso = await this.procesoRepository.findOneBy({ id });
        if (!proceso)
            throw new common_1.NotFoundException(`Proceso ${id} no encontrado`);
        return proceso;
    }
    async update(id, dto) {
        await this.procesoRepository.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const proceso = await this.findOne(id);
        await this.procesoRepository.remove(proceso);
    }
    async removeAll() {
        await this.procesoRepository.clear();
    }
};
exports.ProcesosService = ProcesosService;
exports.ProcesosService = ProcesosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proceso_entity_1.Proceso)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProcesosService);
//# sourceMappingURL=procesos.service.js.map