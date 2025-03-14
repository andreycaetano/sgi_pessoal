import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RegimeService } from './regime.service';
import { CreateRegimeDto } from './dto/create-regime.dto';
import { UpdateRegimeDto } from './dto/update-regime.dto';

@Controller('regime')
export class RegimeController {
  constructor(private readonly regimeService: RegimeService) {}

  @Post()
  create(@Body() createRegimeDto: CreateRegimeDto) {
    return this.regimeService.create(createRegimeDto);
  }

  @Get()
  findAll() {
    return this.regimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regimeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegimeDto: UpdateRegimeDto) {
    return this.regimeService.update(+id, updateRegimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regimeService.remove(+id);
  }
}
