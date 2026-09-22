import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProcesoDto {
  @ApiProperty({ example: 'Proceso A', description: 'Nombre del proceso' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 10, description: 'Tiempo de ráfaga (burst time) en unidades de tiempo' })
  @IsInt()
  @Min(1)
  burstTime: number;

  @ApiPropertyOptional({ example: 0, description: 'Tiempo de llegada (arrival time)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  arrivalTime?: number;

  @ApiPropertyOptional({ example: 1, description: 'Prioridad (menor número = mayor prioridad)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  prioridad?: number;

  @ApiPropertyOptional({ example: 3, description: 'Tiempo de E/S (bloqueado) después del CPU burst. 0 = sin bloqueo' })
  @IsOptional()
  @IsInt()
  @Min(0)
  ioTime?: number;
}
