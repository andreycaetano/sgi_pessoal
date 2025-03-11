import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { Genero } from './entities/genero.entity';
import { GeneroController } from './genero.controller';
import { GeneroService } from './genero.service';

describe('GeneroController', () => {
  let controller: GeneroController;
  let service: GeneroService;

  const mockGeneroRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneroController],
      providers: [
        GeneroService,
        {
          provide: getRepositoryToken(Genero),
          useValue: mockGeneroRepository,
        },
      ],
    }).compile();

    controller = module.get<GeneroController>(GeneroController);
    service = module.get<GeneroService>(GeneroService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo gênero', async () => {
      const createDto: CreateGeneroDto = {
        name: 'Masculino',
      };

      const expectedResult = {
        id: 1,
        name: 'Masculino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
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

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll();
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('deve retornar array vazio quando não houver registros', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
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

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');
      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando gênero não existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException('Gênero com o ID 999 não encontrado'),
        );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(999);
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      await expect(controller.findOne('abc')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um gênero', async () => {
      const updateDto: UpdateGeneroDto = {
        name: 'Masculino',
      };

      const expectedResult = {
        id: 1,
        name: 'Masculino',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateDto);
      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('deve lançar NotFoundException quando gênero não existe', async () => {
      const updateDto: UpdateGeneroDto = {
        name: 'Masculino',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException('Gênero não encontrado'));

      await expect(controller.update('999', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover um gênero', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1');
      expect(result).toEqual(undefined);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando gênero não existe', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new NotFoundException('Gênero com o ID 999 não encontrado'),
        );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      await expect(controller.remove('abc')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
