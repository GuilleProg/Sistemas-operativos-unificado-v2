import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SimulacionesService } from './simulaciones.service';

@ApiTags('Simulaciones (Historial)')
@Controller('simulaciones')
export class SimulacionesController {
  constructor(private readonly service: SimulacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar historial de simulaciones' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una simulación por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
