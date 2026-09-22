import { Repository } from 'typeorm';
import { Simulacion } from './entities/simulacion.entity';
export declare class SimulacionesService {
    private readonly repo;
    constructor(repo: Repository<Simulacion>);
    create(data: {
        algoritmo: string;
        quantum?: number;
        resultado: object;
    }): Promise<Simulacion>;
    findAll(): Promise<Simulacion[]>;
    findOne(id: number): Promise<Simulacion>;
}
