import { ProcesosService } from './procesos.service';
import { CreateProcesoDto } from './dto/create-proceso.dto';
import { Proceso } from './entities/proceso.entity';
export declare class ProcesosController {
    private readonly procesosService;
    constructor(procesosService: ProcesosService);
    create(createProcesoDto: CreateProcesoDto): Promise<Proceso>;
    findAll(): Promise<Proceso[]>;
    findOne(id: number): Promise<Proceso>;
    remove(id: number): Promise<void>;
    removeAll(): Promise<void>;
}
