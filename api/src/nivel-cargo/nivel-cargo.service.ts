import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNivelCargoDto } from './dto/create-nivel-cargo.dto';
import { UpdateNivelCargoDto } from './dto/update-nivel-cargo.dto';
import { NivelCargo } from './entities/nivel-cargo.entity';

@Injectable()
export class NivelCargoService {
  constructor(
    @InjectRepository(NivelCargo)
    private readonly nivelCargoRepository: Repository<NivelCargo>,
  ) {}

  async create(createNivelCargoDto: CreateNivelCargoDto): Promise<NivelCargo> {
    const existingNivelCargo = await this.nivelCargoRepository.findOne({
      where: {
        name: createNivelCargoDto.name,
      },
      withDeleted: true,
    });

    if (existingNivelCargo) {
      if (existingNivelCargo.deletedAt) {
        await this.nivelCargoRepository.restore(existingNivelCargo.id);
        return existingNivelCargo;
      }
      throw new BadRequestException('Nivel de cargo já existe');
    }

    const nivelCargo = this.nivelCargoRepository.create(createNivelCargoDto);
    return this.nivelCargoRepository.save(nivelCargo);
  }

  async findAll(): Promise<NivelCargo[]> {
    return this.nivelCargoRepository.find({ withDeleted: false });
  }

  async findOne(id: number): Promise<NivelCargo> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const nivelCargo = await this.nivelCargoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!nivelCargo) {
      throw new BadRequestException(
        `Nivel de cargo com o ID ${id} não encontrado`,
      );
    }

    return nivelCargo;
  }

  async update(
    id: number,
    updateNivelCargoDto: UpdateNivelCargoDto,
  ): Promise<NivelCargo> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingNivelCargo = await this.nivelCargoRepository.findOne({
      where: { name: updateNivelCargoDto.name },
      withDeleted: true,
    });

    if (existingNivelCargo && existingNivelCargo.id !== id) {
      if (existingNivelCargo.deletedAt) {
        await this.nivelCargoRepository.restore(existingNivelCargo.id);
        return existingNivelCargo;
      }
      throw new BadRequestException('Nivel de cargo já existe');
    }

    const nivelCargo = await this.nivelCargoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!nivelCargo) {
      throw new BadRequestException(
        `Nivel de cargo com o ID ${id} não encontrado`,
      );
    }

    Object.assign(nivelCargo, updateNivelCargoDto);

    return this.nivelCargoRepository.save(nivelCargo);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const nivelCargo = await this.nivelCargoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!nivelCargo) {
      throw new BadRequestException(
        `Nivel de cargo com o ID ${id} não encontrado`,
      );
    }

    await this.nivelCargoRepository.softDelete(id);
  }
}
