import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstadoCivilDto } from './dto/create-estado-civil.dto';
import { UpdateEstadoCivilDto } from './dto/update-estado-civil.dto';
import { EstadoCivil } from './entities/estado-civil.entity';

@Injectable()
export class EstadoCivilService {
  constructor(
    @InjectRepository(EstadoCivil)
    private readonly estadoCivilRepository: Repository<EstadoCivil>,
  ) {}

  async create(
    createEstadoCivilDto: CreateEstadoCivilDto,
  ): Promise<EstadoCivil> {
    const existingEstadoCivil = await this.estadoCivilRepository.findOne({
      where: { name: createEstadoCivilDto.name },
      withDeleted: true,
    });

    if (existingEstadoCivil) {
      if (existingEstadoCivil.deletedAt) {
        await this.estadoCivilRepository.restore(existingEstadoCivil.id);
        return existingEstadoCivil;
      }
      throw new BadRequestException('Estado civil já existe');
    }

    const estadoCivil = this.estadoCivilRepository.create(createEstadoCivilDto);
    return await this.estadoCivilRepository.save(estadoCivil);
  }

  async findAll(): Promise<EstadoCivil[]> {
    return await this.estadoCivilRepository.find({
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<EstadoCivil> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const estadoCivil = await this.estadoCivilRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!estadoCivil) {
      throw new NotFoundException(`Estado civil com o ID ${id} não encontrado`);
    }

    return estadoCivil;
  }

  async update(
    id: number,
    updateEstadoCivilDto: UpdateEstadoCivilDto,
  ): Promise<EstadoCivil> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingEstadoCivil = await this.estadoCivilRepository.findOne({
      where: { name: updateEstadoCivilDto.name },
      withDeleted: true,
    });

    if (existingEstadoCivil && existingEstadoCivil.id !== id) {
      if (existingEstadoCivil.deletedAt) {
        await this.estadoCivilRepository.restore(existingEstadoCivil.id);
        return existingEstadoCivil;
      }
      throw new BadRequestException('Estado civil já existe');
    }

    const estadoCivil = await this.estadoCivilRepository.findOne({
      where: { id },
    });

    if (!estadoCivil) {
      throw new NotFoundException(`Estado civil com o ID ${id} não encontrado`);
    }

    Object.assign(estadoCivil, updateEstadoCivilDto);
    return await this.estadoCivilRepository.save(estadoCivil);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const estadoCivil = await this.estadoCivilRepository.findOne({
      where: { id },
    });

    if (!estadoCivil) {
      throw new NotFoundException(`Estado civil com o ID ${id} não encontrado`);
    }

    await this.estadoCivilRepository.softDelete(id);
  }
}
