import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIdentidadeGeneroDto } from './dto/create-identidade-genero.dto';
import { UpdateIdentidadeGeneroDto } from './dto/update-identidade-genero.dto';
import { IdentidadeGenero } from './entities/identidade-genero.entity';

@Injectable()
export class IdentidadeGeneroService {
  constructor(
    @InjectRepository(IdentidadeGenero)
    private readonly identidadeGeneroRepository: Repository<IdentidadeGenero>,
  ) {}

  async create(
    createIdentidadeGeneroDto: CreateIdentidadeGeneroDto,
  ): Promise<IdentidadeGenero> {
    const existingIdentidadeGenero =
      await this.identidadeGeneroRepository.findOne({
        where: { name: createIdentidadeGeneroDto.name },
        withDeleted: true,
      });

    if (existingIdentidadeGenero) {
      if (existingIdentidadeGenero.deletedAt) {
        await this.identidadeGeneroRepository.restore(
          existingIdentidadeGenero.id,
        );
        return existingIdentidadeGenero;
      }
      throw new BadRequestException('Identidade de Gênero já existe');
    }

    const identidadeGenero = this.identidadeGeneroRepository.create(
      createIdentidadeGeneroDto,
    );
    return this.identidadeGeneroRepository.save(identidadeGenero);
  }

  async findAll(): Promise<IdentidadeGenero[]> {
    return await this.identidadeGeneroRepository.find({
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<IdentidadeGenero> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const identidadeGenero = await this.identidadeGeneroRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!identidadeGenero) {
      throw new NotFoundException(
        `Identidade de Gênero com o ID ${id} não encontrado`,
      );
    }

    return identidadeGenero;
  }

  async update(
    id: number,
    updateIdentidadeGeneroDto: UpdateIdentidadeGeneroDto,
  ): Promise<IdentidadeGenero> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingIdentidadeGenero =
      await this.identidadeGeneroRepository.findOne({
        where: { name: updateIdentidadeGeneroDto.name },
        withDeleted: true,
      });

    if (existingIdentidadeGenero && existingIdentidadeGenero.id !== id) {
      if (existingIdentidadeGenero.deletedAt) {
        await this.identidadeGeneroRepository.restore(
          existingIdentidadeGenero.id,
        );
        return existingIdentidadeGenero;
      }
      throw new BadRequestException('Identidade de Gênero já existe');
    }

    const identidadeGenero = await this.identidadeGeneroRepository.findOne({
      where: { id },
    });

    if (!identidadeGenero) {
      throw new NotFoundException(
        `Identidade de Gênero com o ID ${id} não encontrado`,
      );
    }

    Object.assign(identidadeGenero, updateIdentidadeGeneroDto);
    return await this.identidadeGeneroRepository.save(identidadeGenero);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const identidadeGenero = await this.identidadeGeneroRepository.findOne({
      where: { id },
    });

    if (!identidadeGenero) {
      throw new NotFoundException(
        `Identidade de Gênero com o ID ${id} não encontrado`,
      );
    }

    await this.identidadeGeneroRepository.softDelete(id);
  }
}
