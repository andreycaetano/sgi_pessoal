import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIdentidadeGeneroDto } from './dto/create-identidade-genero.dto';
import { UpdateIdentidadeGeneroDto } from './dto/update-identidade-genero.dto';
import { IdentidadeGenero } from './entities/identidade-genero.entity';
import { IdentidadeGeneroService } from './identidade-genero.service';

describe('IdentidadeGeneroService', () => {
  let service: IdentidadeGeneroService;
  let repository: Repository<IdentidadeGenero>;

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
        IdentidadeGeneroService,
        {
          provide: getRepositoryToken(IdentidadeGenero),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IdentidadeGeneroService>(IdentidadeGeneroService);
    repository = module.get<Repository<IdentidadeGenero>>(
      getRepositoryToken(IdentidadeGenero),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateIdentidadeGeneroDto = {
      name: 'Cisgênero',
    };

    it('deve criar uma nova identidade de gênero', async () => {
      const expectedResult = {
        id: 1,
        name: 'Cisgênero',
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

    it('deve restaurar uma identidade de gênero que foi deletada', async () => {
      const deletedIdentidadeGenero = {
        id: 1,
        name: 'Cisgênero',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(deletedIdentidadeGenero);
      jest.spyOn(repository, 'restore').mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(result).toEqual(deletedIdentidadeGenero);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: createDto.name },
        withDeleted: true,
      });
      expect(repository.restore).toHaveBeenCalledWith(
        deletedIdentidadeGenero.id,
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando identidade de gênero já existe e não está deletada', async () => {
      const existingIdentidadeGenero = {
        id: 1,
        name: 'Cisgênero',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingIdentidadeGenero);

      await expect(service.create(createDto)).rejects.toThrow(
        new BadRequestException('Identidade de Gênero já existe'),
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
    it('deve retornar uma lista de identidades de gênero', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'Cisgênero',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Transgênero',
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
    it('deve retornar uma identidade de gênero específica', async () => {
      const expectedResult = {
        id: 1,
        name: 'Cisgênero',
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

    it('deve lançar NotFoundException quando identidade de gênero não existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(
          'Identidade de Gênero com o ID 999 não encontrado',
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        withDeleted: false,
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateIdentidadeGeneroDto = {
      name: 'Cisgênero Atualizado',
    };

    it('deve atualizar uma identidade de gênero', async () => {
      const existingIdentidadeGenero = {
        id: 1,
        name: 'Cisgênero',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updatedIdentidadeGenero = {
        ...existingIdentidadeGenero,
        ...updateDto,
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existingIdentidadeGenero);

      jest.spyOn(repository, 'save').mockResolvedValue(updatedIdentidadeGenero);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedIdentidadeGenero);
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

    it('deve restaurar uma identidade de gênero deletada durante a atualização', async () => {
      const deletedIdentidadeGenero = {
        id: 2,
        name: 'Cisgênero Atualizado',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(deletedIdentidadeGenero);

      jest.spyOn(repository, 'restore').mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(deletedIdentidadeGenero);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.restore).toHaveBeenCalledWith(
        deletedIdentidadeGenero.id,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando tentar atualizar para um nome já existente e não deletado', async () => {
      const existingIdentidadeGenero = {
        id: 2,
        name: 'Cisgênero Atualizado',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(existingIdentidadeGenero);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new BadRequestException('Identidade de Gênero já existe'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.save).not.toHaveBeenCalled();
      expect(repository.restore).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      const updateDto: UpdateIdentidadeGeneroDto = {
        name: 'Cisgênero',
      };

      await expect(service.update(NaN, updateDto)).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(repository.findOne).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando identidade de gênero não existe', async () => {
      const updateDto: UpdateIdentidadeGeneroDto = {
        name: 'Cisgênero',
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        new NotFoundException(
          'Identidade de Gênero com o ID 999 não encontrado',
        ),
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
    it('deve remover uma identidade de gênero', async () => {
      const existingIdentidadeGenero = {
        id: 1,
        name: 'Cisgênero',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingIdentidadeGenero);
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

    it('deve lançar NotFoundException quando identidade de gênero não existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException(
          'Identidade de Gênero com o ID 999 não encontrado',
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});
