export class WSCrearProcesoDto {
  nombre: string;
  burstTime: number;
  arrivalTime?: number;
  prioridad?: number;
  ioTime?: number;
}

export class WSEliminarProcesoDto {
  id: number;
}

export class WSSimularDto {
  algoritmo: 'fcfs' | 'sjf' | 'srtf' | 'rr' | 'prioridad';
  quantum?: number;
}

export class WSResponse<T> {
  evento: string;
  exito: boolean;
  data?: T;
  error?: string;
  timestamp: string;

  static ok<T>(evento: string, data: T): WSResponse<T> {
    return { evento, exito: true, data, timestamp: new Date().toISOString() };
  }

  static fail(evento: string, error: string): WSResponse<null> {
    return { evento, exito: false, error, timestamp: new Date().toISOString() };
  }
}
