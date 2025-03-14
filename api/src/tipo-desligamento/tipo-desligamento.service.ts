import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoDesligamentoDto } from './dto/create-tipo-desligamento.dto';
import { UpdateTipoDesligamentoDto } from './dto/update-tipo-desligamento.dto';
import { TipoDesligamento } from './entities/tipo-desligamento.entity';

@Injectable()
export class TipoDesligamentoService {
  constructor(
    @InjectRepository(TipoDesligamento)
    private readonly tipoDesligamentoRepository: Repository<TipoDesligamento>,
  ) {}

  async create(
    createTipoDesligamentoDto: CreateTipoDesligamentoDto,
  ): Promise<TipoDesligamento> {
    const existingTipoDesligamento =
      await this.tipoDesligamentoRepository.findOne({
        where: {
          name: createTipoDesligamentoDto.name,
        },
      });

    if (existingTipoDesligamento) {
      if (existingTipoDesligamento.deletedAt) {
        await this.tipoDesligamentoRepository.restore(
          existingTipoDesligamento.id,
        );
        return existingTipoDesligamento;
      }
      throw new Error('Tipo de desligamento já existe');
    }

    const tipoDesligamento = this.tipoDesligamentoRepository.create(
      createTipoDesligamentoDto,
    );
    return await this.tipoDesligamentoRepository.save(tipoDesligamento);
  }

  async findAll(): Promise<TipoDesligamento[]> {
    return await this.tipoDesligamentoRepository.find({
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<TipoDesligamento> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const tipoDesligamento = await this.tipoDesligamentoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!tipoDesligamento) {
      throw new NotFoundException(
        `Tipo de desligamento com o ID ${id} não encontrado`,
      );
    }

    return tipoDesligamento;
  }

  async update(
    id: number,
    updateTipoDesligamentoDto: UpdateTipoDesligamentoDto,
  ): Promise<TipoDesligamento> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existringTipoDesligamento =
      await this.tipoDesligamentoRepository.findOne({
        where: { name: updateTipoDesligamentoDto.name },
        withDeleted: true,
      });

    if (existringTipoDesligamento && existringTipoDesligamento.id !== id) {
      if (existringTipoDesligamento.deletedAt) {
        await this.tipoDesligamentoRepository.restore(
          existringTipoDesligamento.id,
        );
        return existringTipoDesligamento;
      }
      throw new BadRequestException('Tipo de desligamento já existe');
    }

    const tipoDesligamento = await this.tipoDesligamentoRepository.findOne({
      where: { id },
    });

    if (!tipoDesligamento) {
      throw new NotFoundException(
        `Tipo de desligamento com o ID ${id} não encontrado`,
      );
    }

    Object.assign(tipoDesligamento, updateTipoDesligamentoDto);

    return await this.tipoDesligamentoRepository.save(tipoDesligamento);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const tipoDesligamento = await this.tipoDesligamentoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!tipoDesligamento) {
      throw new NotFoundException(
        `Tipo de desligamento com o ID ${id} não encontrado`,
      );
    }
    await this.tipoDesligamentoRepository.softDelete(id);
  }
}
