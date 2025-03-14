import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrientacaoSexual } from 'src/orientacao-sexual/entities/orientacao-sexual.entity';
import { Repository } from 'typeorm';
import { CreateRacaDto } from './dto/create-raca.dto';
import { UpdateRacaDto } from './dto/update-raca.dto';
import { Raca } from './entities/raca.entity';

@Injectable()
export class RacaService {
  constructor(
    @InjectRepository(Raca)
    private readonly racaRepository: Repository<Raca>,
  ) {}
  async create(createRacaDto: CreateRacaDto): Promise<Raca> {
    const existingRaca = await this.racaRepository.findOne({
      where: { name: createRacaDto.name },
      withDeleted: true,
    });

    if (existingRaca) {
      if (existingRaca.deletedAt) {
        await this.racaRepository.restore(existingRaca.id);
        return existingRaca;
      }
      throw new BadRequestException('Raca já existe');
    }

    const raca = this.racaRepository.create(createRacaDto);

    return await this.racaRepository.save(raca);
  }

  async findAll(): Promise<Raca[]> {
    return await this.racaRepository.find({ withDeleted: false });
  }

  async findOne(id: number): Promise<Raca> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const raca = await this.racaRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!raca) {
      throw new NotFoundException(`Raça com o ID ${id} não encontrado`);
    }

    return raca;
  }

  async update(id: number, updateRacaDto: UpdateRacaDto): Promise<Raca> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingRaca = await this.racaRepository.findOne({
      where: { name: updateRacaDto.name },
      withDeleted: true,
    });

    if (existingRaca && existingRaca.id !== id) {
      if (existingRaca.deletedAt) {
        await this.racaRepository.restore(existingRaca.id);
        return existingRaca;
      }
      throw new BadRequestException('Raça já existe');
    }

    const raca = await this.racaRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!OrientacaoSexual) {
      throw new NotFoundException(`Raça com o ID ${id} não encontrado`);
    }

    Object.assign(raca, updateRacaDto);

    return await this.racaRepository.save(raca);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const raca = await this.racaRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!raca) {
      throw new NotFoundException(`Raça com o ID ${id} não encontrado`);
    }

    await this.racaRepository.softDelete(id);
  }
}
