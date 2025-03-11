import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateIdentidadeGeneroDto } from './dto/create-identidade-genero.dto';
import { UpdateIdentidadeGeneroDto } from './dto/update-identidade-genero.dto';
import { IdentidadeGeneroService } from './identidade-genero.service';

@Controller('identidade-genero')
export class IdentidadeGeneroController {
  constructor(
    private readonly identidadeGeneroService: IdentidadeGeneroService,
  ) {}

  @Post()
  async create(@Body() createIdentidadeGeneroDto: CreateIdentidadeGeneroDto) {
    return await this.identidadeGeneroService.create(createIdentidadeGeneroDto);
  }

  @Get()
  async findAll() {
    return await this.identidadeGeneroService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.identidadeGeneroService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIdentidadeGeneroDto: UpdateIdentidadeGeneroDto,
  ) {
    return await this.identidadeGeneroService.update(
      +id,
      updateIdentidadeGeneroDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.identidadeGeneroService.remove(+id);
  }
}
