import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrientacaoSexualService } from './orientacao-sexual.service';
import { CreateOrientacaoSexualDto } from './dto/create-orientacao-sexual.dto';
import { UpdateOrientacaoSexualDto } from './dto/update-orientacao-sexual.dto';

@Controller('orientacao-sexual')
export class OrientacaoSexualController {
  constructor(private readonly orientacaoSexualService: OrientacaoSexualService) {}

  @Post()
  create(@Body() createOrientacaoSexualDto: CreateOrientacaoSexualDto) {
    return this.orientacaoSexualService.create(createOrientacaoSexualDto);
  }

  @Get()
  findAll() {
    return this.orientacaoSexualService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orientacaoSexualService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrientacaoSexualDto: UpdateOrientacaoSexualDto) {
    return this.orientacaoSexualService.update(+id, updateOrientacaoSexualDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orientacaoSexualService.remove(+id);
  }
}
