import { SimulacionesService } from './simulaciones.service';
export declare class SimulacionesController {
    private readonly service;
    constructor(service: SimulacionesService);
    findAll(): Promise<import("./entities/simulacion.entity").Simulacion[]>;
    findOne(id: number): Promise<import("./entities/simulacion.entity").Simulacion>;
}
