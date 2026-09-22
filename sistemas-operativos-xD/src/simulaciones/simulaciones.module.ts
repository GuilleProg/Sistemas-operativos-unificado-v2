import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Simulacion } from './entities/simulacion.entity';
import { SimulacionesService } from './simulaciones.service';
import { SimulacionesController } from './simulaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Simulacion])],
  controllers: [SimulacionesController],
  providers: [SimulacionesService],
  exports: [SimulacionesService],
})
export class SimulacionesModule {}
