export declare enum EstadoProceso {
    NUEVO = "nuevo",
    LISTO = "listo",
    EJECUTANDO = "ejecutando",
    BLOQUEADO = "bloqueado",
    TERMINADO = "terminado"
}
export declare class Proceso {
    id: number;
    nombre: string;
    burstTime: number;
    arrivalTime: number;
    prioridad: number;
    ioTime: number;
    estado: EstadoProceso;
}
