import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PlanificadorService, ResultadoSimulacion } from './planificador.service';
import { ProcesosService } from '../procesos/procesos.service';
import { SimulacionesService } from '../simulaciones/simulaciones.service';

@ApiTags('Simulación')
@Controller('simular')
export class PlanificadorController {
  constructor(
    private readonly planificadorService: PlanificadorService,
    private readonly procesosService: ProcesosService,
    private readonly simulacionesService: SimulacionesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Ejecutar simulación con los procesos existentes' })
  @ApiQuery({ name: 'algoritmo', enum: ['fcfs', 'sjf', 'srtf', 'rr', 'prioridad'], description: 'Algoritmo de planificación' })
  @ApiQuery({ name: 'quantum', required: false, description: 'Quantum para Round Robin (requerido si algoritmo=rr)' })
  @ApiResponse({ status: 200, description: 'Resultado de la simulación con Gantt y métricas' })
  async simular(
    @Query('algoritmo') algoritmo: string,
    @Query('quantum') quantum?: string,
  ) {
    const procesos = await this.procesosService.findAll();
    const resultado = this.planificadorService.simular(
      procesos,
      algoritmo,
      quantum ? parseInt(quantum, 10) : undefined,
    );

    const simulacion = await this.simulacionesService.create({
      algoritmo: resultado.algoritmo,
      quantum: resultado.quantum,
      resultado: resultado as object,
    });

    return {
      id: simulacion.id,
      ...resultado,
    };
  }
}
