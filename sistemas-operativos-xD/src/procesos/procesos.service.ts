import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proceso, EstadoProceso } from './entities/proceso.entity';
import { CreateProcesoDto } from './dto/create-proceso.dto';

@Injectable()
export class ProcesosService {
  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepository: Repository<Proceso>,
  ) {}

  async create(createProcesoDto: CreateProcesoDto): Promise<Proceso> {
    const proceso = this.procesoRepository.create({
      ...createProcesoDto,
      burstTime: createProcesoDto.burstTime,
      arrivalTime: createProcesoDto.arrivalTime ?? 0,
      prioridad: createProcesoDto.prioridad ?? 1,
      ioTime: createProcesoDto.ioTime ?? 0,
      estado: EstadoProceso.NUEVO,
    });
    return this.procesoRepository.save(proceso);
  }

  async findAll(): Promise<Proceso[]> {
    return this.procesoRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Proceso> {
    const proceso = await this.procesoRepository.findOneBy({ id });
    if (!proceso) throw new NotFoundException(`Proceso ${id} no encontrado`);
    return proceso;
  }

  async update(id: number, dto: Partial<CreateProcesoDto>): Promise<Proceso> {
    await this.procesoRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const proceso = await this.findOne(id);
    await this.procesoRepository.remove(proceso);
  }

  async removeAll(): Promise<void> {
    await this.procesoRepository.clear();
  }
}
