import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrientacaoSexualDto } from './dto/create-orientacao-sexual.dto';
import { UpdateOrientacaoSexualDto } from './dto/update-orientacao-sexual.dto';
import { OrientacaoSexual } from './entities/orientacao-sexual.entity';

@Injectable()
export class OrientacaoSexualService {
  constructor(
    @InjectRepository(OrientacaoSexual)
    private readonly orientacaoSexualRepository: Repository<OrientacaoSexual>,
  ) {}

  async create(
    createOrientacaoSexualDto: CreateOrientacaoSexualDto,
  ): Promise<OrientacaoSexual> {
    const existingOrientacaoSexual =
      await this.orientacaoSexualRepository.findOne({
        where: { name: createOrientacaoSexualDto.name },
        withDeleted: true,
      });

    if (existingOrientacaoSexual) {
      if (existingOrientacaoSexual.deletedAt) {
        await this.orientacaoSexualRepository.restore(
          existingOrientacaoSexual.id,
        );
        return existingOrientacaoSexual;
      }
      throw new BadRequestException('Orientação Sexual já existe');
    }

    const orientacaoSexual = this.orientacaoSexualRepository.create(
      createOrientacaoSexualDto,
    );
    return await this.orientacaoSexualRepository.save(orientacaoSexual);
  }

  async findAll(): Promise<OrientacaoSexual[]> {
    return await this.orientacaoSexualRepository.find({
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<OrientacaoSexual> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const orientacaoSexual = await this.orientacaoSexualRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!orientacaoSexual) {
      throw new NotFoundException(
        `Orientação Sexual com o ID ${id} não encontrado`,
      );
    }

    return orientacaoSexual;
  }

  async update(
    id: number,
    updateOrientacaoSexualDto: UpdateOrientacaoSexualDto,
  ): Promise<OrientacaoSexual> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingOrientacaoSexual =
      await this.orientacaoSexualRepository.findOne({
        where: { name: updateOrientacaoSexualDto.name },
        withDeleted: true,
      });

    if (existingOrientacaoSexual && existingOrientacaoSexual.id !== id) {
      if (existingOrientacaoSexual.deletedAt) {
        await this.orientacaoSexualRepository.restore(
          existingOrientacaoSexual.id,
        );
        return existingOrientacaoSexual;
      }
      throw new BadRequestException('Orientação Sexual já existe');
    }

    const orientacaoSexual = await this.orientacaoSexualRepository.findOne({
      where: { id },
    });

    if (!orientacaoSexual) {
      throw new NotFoundException(
        `Orientação Sexual com o ID ${id} não encontrado`,
      );
    }

    Object.assign(orientacaoSexual, updateOrientacaoSexualDto);

    return await this.orientacaoSexualRepository.save(orientacaoSexual);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const orientacaoSexual = await this.orientacaoSexualRepository.findOne({
      where: { id },
    });

    if (!orientacaoSexual) {
      throw new NotFoundException(
        `Orientação Sexual com o ID ${id} não encontrado`,
      );
    }

    await this.orientacaoSexualRepository.softDelete(id);
  }
}
