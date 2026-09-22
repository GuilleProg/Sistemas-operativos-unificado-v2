import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcesosModule } from './procesos/procesos.module';
import { PlanificadorModule } from './planificador/planificador.module';
import { SimulacionesModule } from './simulaciones/simulaciones.module';
import { WebsocketModule } from './websocket/websocket.module';
import { Proceso } from './procesos/entities/proceso.entity';
import { Simulacion } from './simulaciones/entities/simulacion.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'gj28752317',
      database: process.env.DB_NAME || 'ms_cpu',
      entities: [Proceso, Simulacion],
      synchronize: true,
    }),
    ProcesosModule,
    PlanificadorModule,
    SimulacionesModule,
    WebsocketModule,
  ],
})
export class AppModule {}
