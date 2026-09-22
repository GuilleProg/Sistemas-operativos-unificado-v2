export declare class WSCrearProcesoDto {
    nombre: string;
    burstTime: number;
    arrivalTime?: number;
    prioridad?: number;
    ioTime?: number;
}
export declare class WSEliminarProcesoDto {
    id: number;
}
export declare class WSSimularDto {
    algoritmo: 'fcfs' | 'sjf' | 'srtf' | 'rr' | 'prioridad';
    quantum?: number;
}
export declare class WSResponse<T> {
    evento: string;
    exito: boolean;
    data?: T;
    error?: string;
    timestamp: string;
    static ok<T>(evento: string, data: T): WSResponse<T>;
    static fail(evento: string, error: string): WSResponse<null>;
}
