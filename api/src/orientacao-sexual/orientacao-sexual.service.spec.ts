import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrientacaoSexualDto } from './dto/create-orientacao-sexual.dto';
import { UpdateOrientacaoSexualDto } from './dto/update-orientacao-sexual.dto';
import { OrientacaoSexual } from './entities/orientacao-sexual.entity';
import { OrientacaoSexualService } from './orientacao-sexual.service';

describe('OrientacaoSexualService', () => {
  let service: OrientacaoSexualService;
  let repository: Repository<OrientacaoSexual>;

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
        OrientacaoSexualService,
        {
          provide: getRepositoryToken(OrientacaoSexual),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrientacaoSexualService>(OrientacaoSexualService);
    repository = module.get<Repository<OrientacaoSexual>>(
      getRepositoryToken(OrientacaoSexual),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateOrientacaoSexualDto = {
      name: 'Heterosexual',
    };

    it('deve criar uma nova orientação sexual', async () => {
      const expectedResult = {
        id: 1,
        name: 'Heterosexual',
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

    it('deve restaurar uma orientação sexual deletada', async () => {
      const deletedOrientacaoSexual = {
        id: 1,
        name: 'Heterosexual',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(deletedOrientacaoSexual);
      jest.spyOn(repository, 'restore').mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(result).toEqual(deletedOrientacaoSexual);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: createDto.name },
        withDeleted: true,
      });
      expect(repository.restore).toHaveBeenCalledWith(
        deletedOrientacaoSexual.id,
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando a orientação sexual já existe', async () => {
      const existingOrientacaoSexual = {
        id: 1,
        name: 'Heterosexual',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingOrientacaoSexual);

      await expect(service.create(createDto)).rejects.toThrow(
        new BadRequestException('Orientação Sexual já existe'),
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
    it('deve retornar todas as orientações sexuais', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'Heterosexual',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Homosexual',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(repository.find).toHaveBeenCalledWith({ withDeleted: false });
    });

    it('deve retornar um array vazio quando não houver registros', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledWith({ withDeleted: false });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma orientação sexual específica', async () => {
      const expectedResult = {
        id: 1,
        name: 'Heterosexual',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedResult);

      const result = await service.findOne(expectedResult.id);

      expect(result).toEqual(expectedResult);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: expectedResult.id },
        withDeleted: false,
      });
    });

    it('deve lançar BadRequestException quando o ID é inválido', async () => {
      await expect(service.findOne(NaN)).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando a orientação sexual não existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new BadRequestException(
          'Orientação Sexual com o ID 999 não encontrado',
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        withDeleted: false,
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateOrientacaoSexualDto = {
      name: 'Bisexual',
    };

    it('deve atualizar uma orientação sexual', async () => {
      const existingOrientacaoSexual = {
        id: 1,
        name: 'Heterosexual',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updatedOrientacaoSexual = {
        ...existingOrientacaoSexual,
        ...updateDto,
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existingOrientacaoSexual);

      jest.spyOn(repository, 'save').mockResolvedValue(updatedOrientacaoSexual);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedOrientacaoSexual);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedOrientacaoSexual);
    });

    it('deve restaurar uma orientação sexual durante a atualização', async () => {
      const deletedOrientacaoSexual = {
        id: 2,
        name: 'Homosexual',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(deletedOrientacaoSexual);
      jest.spyOn(repository, 'restore').mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(deletedOrientacaoSexual);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.restore).toHaveBeenCalledWith(
        deletedOrientacaoSexual.id,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando tentar atualizar para um nome já existente e não deletado', async () => {
      const existingOrientacaoSexual = {
        id: 2,
        name: 'Bisexual',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingOrientacaoSexual);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new BadRequestException('Orientação Sexual já existe'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateDto.name },
        withDeleted: true,
      });
      expect(repository.save).not.toHaveBeenCalled();
      expect(repository.restore).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando o ID é inválido', async () => {
      await expect(service.update(NaN, updateDto)).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(repository.findOne).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando a orientação sexual não existe', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        new NotFoundException('Orientação Sexual com o ID 999 não encontrado'),
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
    it('deve remover uma orientação sexual', async () => {
      const existingOrientacaoSexual = {
        id: 1,
        name: 'Heterosexual',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingOrientacaoSexual);
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

    it('deve lançar BadRequestException quando o ID é inválido', async () => {
      await expect(service.remove(NaN)).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(repository.findOne).not.toHaveBeenCalled();
      expect(repository.softDelete).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando a orientação sexual não existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Orientação Sexual com o ID 999 não encontrado'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});
