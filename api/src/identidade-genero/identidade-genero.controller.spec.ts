import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateIdentidadeGeneroDto } from './dto/create-identidade-genero.dto';
import { UpdateIdentidadeGeneroDto } from './dto/update-identidade-genero.dto';
import { IdentidadeGeneroController } from './identidade-genero.controller';
import { IdentidadeGeneroService } from './identidade-genero.service';

describe('IdentidadeGeneroController', () => {
  let controller: IdentidadeGeneroController;
  let service: IdentidadeGeneroService;

  const mockIdentidadeGeneroService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentidadeGeneroController],
      providers: [
        {
          provide: IdentidadeGeneroService,
          useValue: mockIdentidadeGeneroService,
        },
      ],
    }).compile();

    controller = module.get<IdentidadeGeneroController>(
      IdentidadeGeneroController,
    );
    service = module.get<IdentidadeGeneroService>(IdentidadeGeneroService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova identidade de gênero', async () => {
      const createDto: CreateIdentidadeGeneroDto = {
        name: 'Cisgênero',
      };

      const expectedResult = {
        id: 1,
        name: 'Cisgênero',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('deve lançar BadRequestException quando identidade de gênero já existe', async () => {
      const createDto: CreateIdentidadeGeneroDto = {
        name: 'Cisgênero',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new BadRequestException('Identidade de Gênero já existe'),
        );

      await expect(controller.create(createDto)).rejects.toThrow(
        new BadRequestException('Identidade de Gênero já existe'),
      );

      expect(service.create).toHaveBeenCalledWith(createDto);
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
    it('deve retornar uma identidade de gênero específica', async () => {
      const expectedResult = {
        id: 1,
        name: 'Cisgênero',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new BadRequestException('ID inválido'));

      await expect(controller.findOne('abc')).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(service.findOne).toHaveBeenCalledWith(NaN);
    });

    it('deve lançar NotFoundException quando identidade de gênero não existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(
            'Identidade de Gênero com o ID 999 não encontrado',
          ),
        );

      await expect(controller.findOne('999')).rejects.toThrow(
        new NotFoundException(
          'Identidade de Gênero com o ID 999 não encontrado',
        ),
      );

      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('deve atualizar uma identidade de gênero', async () => {
      const updateDto: UpdateIdentidadeGeneroDto = {
        name: 'Cisgênero Atualizado',
      };

      const expectedResult = {
        id: 1,
        name: 'Cisgênero Atualizado',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      const updateDto: UpdateIdentidadeGeneroDto = {
        name: 'Cisgênero',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new BadRequestException('ID inválido'));

      await expect(controller.update('abc', updateDto)).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(service.update).toHaveBeenCalledWith(NaN, updateDto);
    });

    it('deve lançar NotFoundException quando identidade de gênero não existe', async () => {
      const updateDto: UpdateIdentidadeGeneroDto = {
        name: 'Cisgênero',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new NotFoundException(
            'Identidade de Gênero com o ID 999 não encontrado',
          ),
        );

      await expect(controller.update('999', updateDto)).rejects.toThrow(
        new NotFoundException(
          'Identidade de Gênero com o ID 999 não encontrado',
        ),
      );

      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('deve lançar BadRequestException quando tentar atualizar para um nome já existente', async () => {
      const updateDto: UpdateIdentidadeGeneroDto = {
        name: 'Transgênero',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new BadRequestException('Identidade de Gênero já existe'),
        );

      await expect(controller.update('1', updateDto)).rejects.toThrow(
        new BadRequestException('Identidade de Gênero já existe'),
      );

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover uma identidade de gênero', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('deve lançar BadRequestException quando ID é inválido', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new BadRequestException('ID inválido'));

      await expect(controller.remove('abc')).rejects.toThrow(
        new BadRequestException('ID inválido'),
      );

      expect(service.remove).toHaveBeenCalledWith(NaN);
    });

    it('deve lançar NotFoundException quando identidade de gênero não existe', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new NotFoundException(
            'Identidade de Gênero com o ID 999 não encontrado',
          ),
        );

      await expect(controller.remove('999')).rejects.toThrow(
        new NotFoundException(
          'Identidade de Gênero com o ID 999 não encontrado',
        ),
      );

      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
