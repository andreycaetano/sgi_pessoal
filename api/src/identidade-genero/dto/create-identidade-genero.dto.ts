import { IsString } from 'class-validator';

export class CreateIdentidadeGeneroDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
