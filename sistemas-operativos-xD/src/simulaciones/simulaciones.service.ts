import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Simulacion } from './entities/simulacion.entity';

@Injectable()
export class SimulacionesService {
  constructor(
    @InjectRepository(Simulacion)
    private readonly repo: Repository<Simulacion>,
  ) {}

  async create(data: { algoritmo: string; quantum?: number; resultado: object }): Promise<Simulacion> {
    return this.repo.save(data);
  }

  async findAll(): Promise<Simulacion[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Simulacion> {
    const sim = await this.repo.findOneBy({ id });
    if (!sim) throw new NotFoundException(`Simulación ${id} no encontrada`);
    return sim;
  }
}
