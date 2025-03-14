import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateNivelCargoDto } from './dto/create-nivel-cargo.dto';
import { UpdateNivelCargoDto } from './dto/update-nivel-cargo.dto';
import { NivelCargoService } from './nivel-cargo.service';

@Controller('nivel-cargo')
export class NivelCargoController {
  constructor(private readonly nivelCargoService: NivelCargoService) {}

  @Post()
  create(@Body() createNivelCargoDto: CreateNivelCargoDto) {
    return this.nivelCargoService.create(createNivelCargoDto);
  }

  @Get()
  findAll() {
    return this.nivelCargoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nivelCargoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNivelCargoDto: UpdateNivelCargoDto,
  ) {
    return this.nivelCargoService.update(+id, updateNivelCargoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nivelCargoService.remove(+id);
  }
}
