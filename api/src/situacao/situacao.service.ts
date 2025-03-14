import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSituacaoDto } from './dto/create-situacao.dto';
import { UpdateSituacaoDto } from './dto/update-situacao.dto';
import { Situacao } from './entities/situacao.entity';

@Injectable()
export class SituacaoService {
  constructor(
    @InjectRepository(Situacao)
    private readonly situacaoRepository: Repository<Situacao>,
  ) {}

  async create(createSituacaoDto: CreateSituacaoDto): Promise<Situacao> {
    const existingSituacao = await this.situacaoRepository.findOne({
      where: {
        nome: createSituacaoDto.nome,
      },
      withDeleted: true,
    });

    if (existingSituacao) {
      if (existingSituacao.deletedAt) {
        await this.situacaoRepository.restore(existingSituacao.id);
        return existingSituacao;
      }
      throw new BadRequestException('Situação já existe');
    }

    const situacao = this.situacaoRepository.create(createSituacaoDto);
    return await this.situacaoRepository.save(situacao);
  }

  async findAll(): Promise<Situacao[]> {
    return await this.situacaoRepository.find({
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<Situacao> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const situacao = await this.situacaoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!situacao) {
      throw new BadRequestException(`Situação com o ID ${id} não encontrada`);
    }
    return situacao;
  }

  async update(
    id: number,
    updateSituacaoDto: UpdateSituacaoDto,
  ): Promise<Situacao> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingSituacao = await this.situacaoRepository.findOne({
      where: { nome: updateSituacaoDto.nome },
      withDeleted: true,
    });

    if (existingSituacao && existingSituacao.id !== id) {
      if (existingSituacao.deletedAt) {
        await this.situacaoRepository.restore(existingSituacao.id);
        return existingSituacao;
      }
      throw new BadRequestException('Situação já existe');
    }

    const situacao = await this.situacaoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!situacao) {
      throw new BadRequestException(`Situação com o ID ${id} não encontrada`);
    }

    Object.assign(existingSituacao, updateSituacaoDto);
    return await this.situacaoRepository.save(existingSituacao);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const situacao = await this.situacaoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!situacao) {
      throw new BadRequestException(`Situação com o ID ${id} não encontrada`);
    }

    await this.situacaoRepository.softDelete(situacao);
  }
}
