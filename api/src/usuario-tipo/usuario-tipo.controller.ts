import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUsuarioTipoDto } from './dto/create-usuario-tipo.dto';
import { UpdateUsuarioTipoDto } from './dto/update-usuario-tipo.dto';
import { UsuarioTipoService } from './usuario-tipo.service';

@Controller('usuario-tipo')
export class UsuarioTipoController {
  constructor(private readonly usuarioTipoService: UsuarioTipoService) {}

  @Post()
  create(@Body() createUsuarioTipoDto: CreateUsuarioTipoDto) {
    return this.usuarioTipoService.create(createUsuarioTipoDto);
  }

  @Get()
  findAll() {
    return this.usuarioTipoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioTipoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsuarioTipoDto: UpdateUsuarioTipoDto,
  ) {
    return this.usuarioTipoService.update(+id, updateUsuarioTipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioTipoService.remove(+id);
  }
}
