import { Repository } from 'typeorm';
import { Proceso } from './entities/proceso.entity';
import { CreateProcesoDto } from './dto/create-proceso.dto';
export declare class ProcesosService {
    private readonly procesoRepository;
    constructor(procesoRepository: Repository<Proceso>);
    create(createProcesoDto: CreateProcesoDto): Promise<Proceso>;
    findAll(): Promise<Proceso[]>;
    findOne(id: number): Promise<Proceso>;
    update(id: number, dto: Partial<CreateProcesoDto>): Promise<Proceso>;
    remove(id: number): Promise<void>;
    removeAll(): Promise<void>;
}
