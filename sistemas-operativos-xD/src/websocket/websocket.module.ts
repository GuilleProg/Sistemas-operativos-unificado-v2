import { Module } from '@nestjs/common';
import { ProcesosModule } from '../procesos/procesos.module';
import { PlanificadorModule } from '../planificador/planificador.module';
import { SimulacionesModule } from '../simulaciones/simulaciones.module';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [ProcesosModule, PlanificadorModule, SimulacionesModule],
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
