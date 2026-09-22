import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProcesosService } from './procesos.service';
import { CreateProcesoDto } from './dto/create-proceso.dto';
import { Proceso } from './entities/proceso.entity';

@ApiTags('Procesos')
@Controller('procesos')
export class ProcesosController {
  constructor(private readonly procesosService: ProcesosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proceso' })
  @ApiResponse({ status: 201, type: Proceso })
  create(@Body() createProcesoDto: CreateProcesoDto) {
    return this.procesosService.create(createProcesoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los procesos' })
  @ApiResponse({ status: 200, type: [Proceso] })
  findAll() {
    return this.procesosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proceso por ID' })
  @ApiResponse({ status: 200, type: Proceso })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.procesosService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proceso por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.procesosService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar todos los procesos' })
  removeAll() {
    return this.procesosService.removeAll();
  }
}
