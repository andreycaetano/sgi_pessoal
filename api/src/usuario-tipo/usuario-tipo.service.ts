import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioTipoDto } from './dto/create-usuario-tipo.dto';
import { UpdateUsuarioTipoDto } from './dto/update-usuario-tipo.dto';
import { UsuarioTipo } from './entities/usuario-tipo.entity';

@Injectable()
export class UsuarioTipoService {
  constructor(
    @InjectRepository(UsuarioTipo)
    private usuarioTipoRepository: Repository<UsuarioTipo>,
  ) {}

  async create(
    createUsuarioTipoDto: CreateUsuarioTipoDto,
  ): Promise<UsuarioTipo> {
    const existingUsuarioTipo = await this.usuarioTipoRepository.findOne({
      where: { name: createUsuarioTipoDto.name },
      withDeleted: true,
    });

    if (existingUsuarioTipo) {
      if (existingUsuarioTipo.deletedAt) {
        await this.usuarioTipoRepository.restore(existingUsuarioTipo.id);
        return existingUsuarioTipo;
      }
      throw new BadRequestException('Usuario tipo já existe');
    }

    const usuarioTipo = this.usuarioTipoRepository.create(createUsuarioTipoDto);
    return this.usuarioTipoRepository.save(usuarioTipo);
  }

  async findAll(): Promise<UsuarioTipo[]> {
    return await this.usuarioTipoRepository.find({
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<UsuarioTipo> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const usuarioTipo = await this.usuarioTipoRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!usuarioTipo) {
      throw new BadRequestException(
        `Usuario tipo com o ID ${id} não encontrado`,
      );
    }

    return usuarioTipo;
  }

  async update(
    id: number,
    updateUsuarioTipoDto: UpdateUsuarioTipoDto,
  ): Promise<UsuarioTipo> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingUsuarioTipo = await this.usuarioTipoRepository.findOne({
      where: { name: updateUsuarioTipoDto.name },
      withDeleted: true,
    });

    if (existingUsuarioTipo && existingUsuarioTipo.id !== id) {
      if (existingUsuarioTipo.deletedAt) {
        await this.usuarioTipoRepository.restore(existingUsuarioTipo.id);
        return existingUsuarioTipo;
      }
      throw new BadRequestException('Usuario tipo já existe');
    }

    const usuarioTipo = await this.usuarioTipoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!usuarioTipo) {
      throw new BadRequestException(
        `Usuario tipo com o ID ${id} não encontrado`,
      );
    }

    Object.assign(usuarioTipo, updateUsuarioTipoDto);

    return this.usuarioTipoRepository.save(usuarioTipo);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const usuarioTipo = await this.usuarioTipoRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!usuarioTipo) {
      throw new BadRequestException(
        `Usuario tipo com o ID ${id} não encontrado`,
      );
    }

    await this.usuarioTipoRepository.softDelete(usuarioTipo);
  }
}
