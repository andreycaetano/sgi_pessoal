import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoDesligamentoService } from './tipo-desligamento.service';
import { CreateTipoDesligamentoDto } from './dto/create-tipo-desligamento.dto';
import { UpdateTipoDesligamentoDto } from './dto/update-tipo-desligamento.dto';

@Controller('tipo-desligamento')
export class TipoDesligamentoController {
  constructor(
    private readonly tipoDesligamentoService: TipoDesligamentoService,
  ) {}

  @Post()
  create(@Body() createTipoDesligamentoDto: CreateTipoDesligamentoDto) {
    return this.tipoDesligamentoService.create(createTipoDesligamentoDto);
  }

  @Get()
  findAll() {
    return this.tipoDesligamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoDesligamentoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTipoDesligamentoDto: UpdateTipoDesligamentoDto,
  ) {
    return this.tipoDesligamentoService.update(+id, updateTipoDesligamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoDesligamentoService.remove(+id);
  }
}
