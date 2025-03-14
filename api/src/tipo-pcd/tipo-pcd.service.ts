import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoPcdDto } from './dto/create-tipo-pcd.dto';
import { UpdateTipoPcdDto } from './dto/update-tipo-pcd.dto';
import { TipoPcd } from './entities/tipo-pcd.entity';

@Injectable()
export class TipoPcdService {
  constructor(
    @InjectRepository(TipoPcd)
    private readonly tipoPcdRepository: Repository<TipoPcd>,
  ) {}

  async create(createTipoPcdDto: CreateTipoPcdDto): Promise<TipoPcd> {
    const existingTipoPcd = await this.tipoPcdRepository.findOne({
      where: {
        name: createTipoPcdDto.name,
      },
      withDeleted: true,
    });

    if (existingTipoPcd) {
      if (existingTipoPcd.deletedAt) {
        await this.tipoPcdRepository.restore(existingTipoPcd.id);
        return existingTipoPcd;
      }
      throw new BadRequestException('Tipo de PCD já existe');
    }

    const tipoPcd = this.tipoPcdRepository.create(createTipoPcdDto);
    return this.tipoPcdRepository.save(tipoPcd);
  }

  async findAll(): Promise<TipoPcd[]> {
    return await this.tipoPcdRepository.find({ withDeleted: false });
  }

  async findOne(id: number): Promise<TipoPcd> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const tipoPcd = await this.tipoPcdRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!tipoPcd) {
      throw new BadRequestException(
        `Tipo de PCD com o ID ${id} não encontrado`,
      );
    }

    return tipoPcd;
  }

  async update(
    id: number,
    updateTipoPcdDto: UpdateTipoPcdDto,
  ): Promise<TipoPcd> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingTipoPcd = await this.tipoPcdRepository.findOne({
      where: { name: updateTipoPcdDto.name },
      withDeleted: true,
    });

    if (existingTipoPcd && existingTipoPcd.id !== id) {
      if (existingTipoPcd.deletedAt) {
        await this.tipoPcdRepository.restore(existingTipoPcd.id);
        return existingTipoPcd;
      }
      throw new BadRequestException('Tipo de PCD já existe');
    }

    const tipoPcd = await this.tipoPcdRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!tipoPcd) {
      throw new BadRequestException(
        `Tipo de PCD com o ID ${id} não encontrado`,
      );
    }

    Object.assign(tipoPcd, updateTipoPcdDto);

    return this.tipoPcdRepository.save(tipoPcd);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const tipoPcd = await this.tipoPcdRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!tipoPcd) {
      throw new BadRequestException(
        `Tipo de PCD com o ID ${id} não encontrado`,
      );
    }

    await this.tipoPcdRepository.softDelete(tipoPcd);
  }
}
