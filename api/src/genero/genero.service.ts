import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { Genero } from './entities/genero.entity';

@Injectable()
export class GeneroService {
  constructor(
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  async create(createGeneroDto: CreateGeneroDto): Promise<Genero> {
    const existingGenero = await this.generoRepository.findOne({
      where: { name: createGeneroDto.name },
      withDeleted: true,
    });

    if (existingGenero) {
      if (existingGenero.deletedAt) {
        await this.generoRepository.restore(existingGenero.id);
        return existingGenero;
      }
      throw new BadRequestException('Gênero já existe');
    }

    const genero = this.generoRepository.create(createGeneroDto);
    return await this.generoRepository.save(genero);
  }

  async findAll(): Promise<Genero[]> {
    return await this.generoRepository.find({
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<Genero> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const genero = await this.generoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!genero) {
      throw new NotFoundException(`Gênero com o ID ${id} não encontrado`);
    }

    return genero;
  }

  async update(id: number, updateGeneroDto: UpdateGeneroDto): Promise<Genero> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingGenero = await this.generoRepository.findOne({
      where: { name: updateGeneroDto.name },
      withDeleted: true,
    });

    if (existingGenero && existingGenero.id !== id) {
      if (existingGenero.deletedAt) {
        await this.generoRepository.restore(existingGenero.id);
        return existingGenero;
      }
      throw new BadRequestException('Gênero já existe');
    }

    const genero = await this.generoRepository.findOne({ where: { id } });

    if (!genero) {
      throw new NotFoundException(`Gênero com o ID ${id} não encontrado`);
    }

    Object.assign(genero, updateGeneroDto);
    return await this.generoRepository.save(genero);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const genero = await this.generoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!genero) {
      throw new NotFoundException(`Gênero com o ID ${id} não encontrado`);
    }

    await this.generoRepository.softDelete(id);
  }
}
