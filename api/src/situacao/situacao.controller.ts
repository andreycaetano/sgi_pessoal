import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SituacaoService } from './situacao.service';
import { CreateSituacaoDto } from './dto/create-situacao.dto';
import { UpdateSituacaoDto } from './dto/update-situacao.dto';

@Controller('situacao')
export class SituacaoController {
  constructor(private readonly situacaoService: SituacaoService) {}

  @Post()
  create(@Body() createSituacaoDto: CreateSituacaoDto) {
    return this.situacaoService.create(createSituacaoDto);
  }

  @Get()
  findAll() {
    return this.situacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.situacaoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSituacaoDto: UpdateSituacaoDto,
  ) {
    return this.situacaoService.update(+id, updateSituacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.situacaoService.remove(+id);
  }
}
