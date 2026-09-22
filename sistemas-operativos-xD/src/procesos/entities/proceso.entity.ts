import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EstadoProceso {
  NUEVO = 'nuevo',
  LISTO = 'listo',
  EJECUTANDO = 'ejecutando',
  BLOQUEADO = 'bloqueado',
  TERMINADO = 'terminado',
}

@Entity()
export class Proceso {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Proceso A' })
  @Column()
  nombre: string;

  @ApiProperty({ example: 10 })
  @Column()
  burstTime: number;

  @ApiPropertyOptional({ example: 0 })
  @Column({ default: 0 })
  arrivalTime: number;

  @ApiPropertyOptional({ example: 1 })
  @Column({ default: 1 })
  prioridad: number;

  @ApiPropertyOptional({ example: 4, description: 'Tiempo de E/S (bloqueado) después del CPU burst. 0 = sin bloqueo' })
  @Column({ default: 0 })
  ioTime: number;

  @ApiProperty({ enum: EstadoProceso, example: EstadoProceso.NUEVO })
  @Column({
    type: 'enum',
    enum: EstadoProceso,
    default: EstadoProceso.NUEVO,
  })
  estado: EstadoProceso;
}
