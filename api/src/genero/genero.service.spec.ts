import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { Genero } from './entities/genero.entity';
import { GeneroService } from './genero.service';

describe('GeneroService', () => {
  let service: GeneroService;
  let repository: Repository<Genero>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneroService,
        {
          provide: getRepositoryToken(Genero),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GeneroService>(GeneroService);
    repository = module.get<Repository<Genero>>(getRepositoryToken(Genero));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateGeneroDto = {
      name: 'Masculino',
    };

    it('deve criar um novo gênero', async () => {
      const expectedResult = {
        id: 1,
        name: 'Masculino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(expectedResult);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: createDto.name },
        withDeleted: true,
      });
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(expectedResult);
    });

    it('deve restaurar um gênero que foi deletado', async () => {
      const deletedGenero = {
        id: 1,
        name: 'Masculino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(deletedGenero);
      jest.spyOn(repository, 'restore').mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(result).toEqual(deletedGenero);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: createDto.name },
        withDeleted: true,
      });
      expect(repository.restore).toHaveBeenCalledWith(deletedGenero.id);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando gênero já existe e não está deletado', async () => {
      const existingGenero = {
        id: 1,
        name: 'Rock',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingGenero);

      await expect(service.create(createDto)).rejects.toThrow(
        new BadRequestException('Gênero já existe'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: createDto.name },
        withDeleted: true,
      });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
      expect(repository.restore).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de gêneros', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'Masculino',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Feminino',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(repository.find).toHaveBeenCalledWith({
        withDeleted: false,
      });
    });

    it('deve retornar array vazio quando não houver registros', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledWith({
        withDeleted: false,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um gênero específico', async () => {
      const expectedResult = {
        id: 1,
        name: 'Masculino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedResult);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedResult);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        withDeleted: false,
      });
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      await expect(service.findOne(NaN)).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando gênero não existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Gênero com o ID 999 não encontrado'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        withDeleted: false,
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateGeneroDto = {
      name: 'Feminino',
    };

    it('deve atualizar um gênero', async () => {
      const existingGenero = {
        id: 1,
        name: 'Masculino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updatedGenero = {
        ...existingGenero,
        ...updateDto,
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existingGenero);

      jest.spyOn(repository, 'save').mockResolvedValue(updatedGenero);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedGenero);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
    });

    it('deve restaurar um gênero deletado durante a atualização', async () => {
      const deletedGenero = {
        id: 2,
        name: 'Feminino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(deletedGenero);

      jest.spyOn(repository, 'restore').mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(deletedGenero);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.restore).toHaveBeenCalledWith(deletedGenero.id);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando tentar atualizar para um nome já existente e não deletado', async () => {
      const existingGenero = {
        id: 2,
        name: 'Feminino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingGenero);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new BadRequestException('Gênero já existe'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.save).not.toHaveBeenCalled();
      expect(repository.restore).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      await expect(service.update(NaN, updateDto)).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(repository.findOne).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando gênero não existe', async () => {
      const updateDto: UpdateGeneroDto = {
        name: 'Masculino',
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        new NotFoundException('Gênero com o ID 999 não encontrado'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um gênero', async () => {
      const existingGenero = {
        id: 1,
        name: 'Masculino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingGenero);
      jest.spyOn(repository, 'softDelete').mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      await expect(service.remove(NaN)).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(repository.findOne).not.toHaveBeenCalled();
      expect(repository.softDelete).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando gênero não existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Gênero com o ID 999 não encontrado'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});
