import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegimeDto } from './dto/create-regime.dto';
import { UpdateRegimeDto } from './dto/update-regime.dto';
import { Regime } from './entities/regime.entity';

@Injectable()
export class RegimeService {
  constructor(
    @InjectRepository(Regime)
    private readonly regimeRepository: Repository<Regime>,
  ) {}

  async create(createRegimeDto: CreateRegimeDto): Promise<Regime> {
    const existingRegime = await this.regimeRepository.findOne({
      where: {
        name: createRegimeDto.name,
      },
    });

    if (existingRegime) {
      if (existingRegime.deletedAt) {
        await this.regimeRepository.restore(existingRegime.id);
        return existingRegime;
      }
      throw new BadRequestException('Regime já existe');
    }

    const regime = this.regimeRepository.create(createRegimeDto);
    return await this.regimeRepository.save(regime);
  }

  async findAll(): Promise<Regime[]> {
    return await this.regimeRepository.find({
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<Regime> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const regime = await this.regimeRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!regime) {
      throw new BadRequestException(`Regime com o ID ${id} não encontrado`);
    }

    return regime;
  }

  async update(id: number, updateRegimeDto: UpdateRegimeDto): Promise<Regime> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingRegime = await this.regimeRepository.findOne({
      where: { name: updateRegimeDto.name },
      withDeleted: true,
    });

    if (existingRegime && existingRegime.id !== id) {
      if (existingRegime.deletedAt) {
        await this.regimeRepository.restore(existingRegime.id);
        return existingRegime;
      }
      throw new BadRequestException('Regime já existe');
    }

    const regime = await this.regimeRepository.findOne({
      where: { id },
    });

    if (!regime) {
      throw new BadRequestException(`Regime com o ID ${id} não encontrado`);
    }

    Object.assign(regime, updateRegimeDto);

    return await this.regimeRepository.save(regime);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const regime = await this.regimeRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!regime) {
      throw new BadRequestException(`Regime com o ID ${id} não encontrado`);
    }
    await this.regimeRepository.softDelete(regime);
  }
}
