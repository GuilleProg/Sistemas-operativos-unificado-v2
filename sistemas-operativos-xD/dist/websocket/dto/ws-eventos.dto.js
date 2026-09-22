"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSResponse = exports.WSSimularDto = exports.WSEliminarProcesoDto = exports.WSCrearProcesoDto = void 0;
class WSCrearProcesoDto {
    nombre;
    burstTime;
    arrivalTime;
    prioridad;
    ioTime;
}
exports.WSCrearProcesoDto = WSCrearProcesoDto;
class WSEliminarProcesoDto {
    id;
}
exports.WSEliminarProcesoDto = WSEliminarProcesoDto;
class WSSimularDto {
    algoritmo;
    quantum;
}
exports.WSSimularDto = WSSimularDto;
class WSResponse {
    evento;
    exito;
    data;
    error;
    timestamp;
    static ok(evento, data) {
        return { evento, exito: true, data, timestamp: new Date().toISOString() };
    }
    static fail(evento, error) {
        return { evento, exito: false, error, timestamp: new Date().toISOString() };
    }
}
exports.WSResponse = WSResponse;
//# sourceMappingURL=ws-eventos.dto.js.map