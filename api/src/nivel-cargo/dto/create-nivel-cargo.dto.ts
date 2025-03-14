import { IsString } from 'class-validator';

export class CreateNivelCargoDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
