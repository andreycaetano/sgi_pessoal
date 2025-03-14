import { IsString } from 'class-validator';

export class CreateGeneroDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
