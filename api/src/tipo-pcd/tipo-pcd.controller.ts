import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoPcdService } from './tipo-pcd.service';
import { CreateTipoPcdDto } from './dto/create-tipo-pcd.dto';
import { UpdateTipoPcdDto } from './dto/update-tipo-pcd.dto';

@Controller('tipo-pcd')
export class TipoPcdController {
  constructor(private readonly tipoPcdService: TipoPcdService) {}

  @Post()
  create(@Body() createTipoPcdDto: CreateTipoPcdDto) {
    return this.tipoPcdService.create(createTipoPcdDto);
  }

  @Get()
  findAll() {
    return this.tipoPcdService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoPcdService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoPcdDto: UpdateTipoPcdDto) {
    return this.tipoPcdService.update(+id, updateTipoPcdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoPcdService.remove(+id);
  }
}
