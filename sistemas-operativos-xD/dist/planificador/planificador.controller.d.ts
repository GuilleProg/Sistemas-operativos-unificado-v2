import { PlanificadorService } from './planificador.service';
import { ProcesosService } from '../procesos/procesos.service';
import { SimulacionesService } from '../simulaciones/simulaciones.service';
export declare class PlanificadorController {
    private readonly planificadorService;
    private readonly procesosService;
    private readonly simulacionesService;
    constructor(planificadorService: PlanificadorService, procesosService: ProcesosService, simulacionesService: SimulacionesService);
    simular(algoritmo: string, quantum?: string): Promise<{
        algoritmo: string;
        quantum?: number;
        gantt: import("./planificador.service").GanttEntry[];
        tiempoEsperaPromedio: number;
        tiempoRetornoPromedio: number;
        metricasPorProceso: {
            procesoId: number;
            procesoNombre: string;
            tiempoLlegada: number;
            tiempoRafaga: number;
            tiempoIO: number;
            tiempoInicio: number;
            tiempoFinal: number;
            tiempoRetorno: number;
            tiempoEspera: number;
        }[];
        estados: {
            tiempo: number;
            procesos: {
                id: number;
                burstRestante?: number;
                estado: string;
            }[];
        }[];
        id: number;
    }>;
}
