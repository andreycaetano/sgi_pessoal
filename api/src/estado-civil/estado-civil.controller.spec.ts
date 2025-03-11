import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateEstadoCivilDto } from './dto/create-estado-civil.dto';
import { UpdateEstadoCivilDto } from './dto/update-estado-civil.dto';
import { EstadoCivil } from './entities/estado-civil.entity';
import { EstadoCivilController } from './estado-civil.controller';
import { EstadoCivilService } from './estado-civil.service';

describe('EstadoCivilController', () => {
  let controller: EstadoCivilController;
  let service: EstadoCivilService;

  const mockEstadoCivilRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoCivilController],
      providers: [
        EstadoCivilService,
        {
          provide: getRepositoryToken(EstadoCivil),
          useValue: mockEstadoCivilRepository,
        },
      ],
    }).compile();

    controller = module.get<EstadoCivilController>(EstadoCivilController);
    service = module.get<EstadoCivilService>(EstadoCivilService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo estado civil', async () => {
      const createDto: CreateEstadoCivilDto = {
        name: 'Casado',
      };

      const expectedResult = {
        id: 1,
        name: 'Casado',
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
    it('deve retornar uma lista de estados civis', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'Casado',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Solteiro',
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
    it('deve retornar um estado civil específico', async () => {
      const expectedResult = {
        id: 1,
        name: 'Casado',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');
      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando estado civil não existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException('Estado civil com o ID 999 não encontrado'),
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
    it('deve atualizar um estado civil', async () => {
      const updateDto: UpdateEstadoCivilDto = {
        name: 'Casado(a)',
      };

      const expectedResult = {
        id: 1,
        name: 'Casado',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateDto);
      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('deve lançar NotFoundException quando estado civil não existe', async () => {
      const updateDto: UpdateEstadoCivilDto = {
        name: 'Casado(a)',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new NotFoundException('Estado civil com o ID 999 não encontrado'),
        );

      await expect(controller.update('999', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover um estado civil', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1');
      expect(result).toEqual(undefined);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando estado civil não existe', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new NotFoundException('Estado civil com o ID 999 não encontrado'),
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
