import { Module } from '@nestjs/common';
import { ProcesosModule } from '../procesos/procesos.module';
import { SimulacionesModule } from '../simulaciones/simulaciones.module';
import { PlanificadorController } from './planificador.controller';
import { PlanificadorService } from './planificador.service';

@Module({
  imports: [ProcesosModule, SimulacionesModule],
  controllers: [PlanificadorController],
  providers: [PlanificadorService],
  exports: [PlanificadorService],
})
export class PlanificadorModule {}
