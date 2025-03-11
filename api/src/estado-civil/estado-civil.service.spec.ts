import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstadoCivilDto } from './dto/create-estado-civil.dto';
import { UpdateEstadoCivilDto } from './dto/update-estado-civil.dto';
import { EstadoCivil } from './entities/estado-civil.entity';
import { EstadoCivilService } from './estado-civil.service';

describe('EstadoCivilService', () => {
  let service: EstadoCivilService;
  let repository: Repository<EstadoCivil>;

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
        EstadoCivilService,
        {
          provide: getRepositoryToken(EstadoCivil),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EstadoCivilService>(EstadoCivilService);
    repository = module.get<Repository<EstadoCivil>>(
      getRepositoryToken(EstadoCivil),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateEstadoCivilDto = {
      name: 'Solteiro',
    };

    it('deve criar um novo estado civil', async () => {
      const expectedResult = {
        id: 1,
        name: 'Solteiro',
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

    it('deve restaurar um estado civil que foi deletado', async () => {
      const deletedEstadoCivil = {
        id: 1,
        name: 'Solteiro',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(deletedEstadoCivil);
      jest.spyOn(repository, 'restore').mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(result).toEqual(deletedEstadoCivil);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: createDto.name },
        withDeleted: true,
      });
      expect(repository.restore).toHaveBeenCalledWith(deletedEstadoCivil.id);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando estado civil já existe e não está deletado', async () => {
      const existingEstadoCivil = {
        id: 1,
        name: 'Solteiro',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingEstadoCivil);

      await expect(service.create(createDto)).rejects.toThrow(
        new BadRequestException('Estado civil já existe'),
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
    it('deve retornar uma lista de estados civis', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'Solteiro',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Casado',
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
    it('deve retornar um estado civil específico', async () => {
      const expectedResult = {
        id: 1,
        name: 'Solteiro',
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

    it('deve lançar NotFoundException quando estado civil não existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Estado civil com o ID 999 não encontrado'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        withDeleted: false,
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateEstadoCivilDto = {
      name: 'Solteiro Atualizado',
    };

    it('deve atualizar um estado civil', async () => {
      const existingEstadoCivil = {
        id: 1,
        name: 'Solteiro',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updatedEstadoCivil = {
        ...existingEstadoCivil,
        ...updateDto,
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existingEstadoCivil);

      jest.spyOn(repository, 'save').mockResolvedValue(updatedEstadoCivil);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedEstadoCivil);
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

    it('deve restaurar um estado civil deletado durante a atualização', async () => {
      const deletedEstadoCivil = {
        id: 2,
        name: 'Solteiro Atualizado',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(deletedEstadoCivil);

      jest.spyOn(repository, 'restore').mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(deletedEstadoCivil);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.restore).toHaveBeenCalledWith(deletedEstadoCivil.id);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando tentar atualizar para um nome já existente e não deletado', async () => {
      const existingEstadoCivil = {
        id: 2,
        name: 'Solteiro Atualizado',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(existingEstadoCivil);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new BadRequestException('Estado civil já existe'),
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

    it('deve lançar NotFoundException quando estado civil não existe', async () => {
      const updateDto: UpdateEstadoCivilDto = {
        name: 'Solteiro',
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        new NotFoundException('Estado civil com o ID 999 não encontrado'),
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
    it('deve remover um estado civil', async () => {
      const existingEstadoCivil = {
        id: 1,
        name: 'Solteiro',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingEstadoCivil);
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

    it('deve lançar NotFoundException quando estado civil não existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Estado civil com o ID 999 não encontrado'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});
