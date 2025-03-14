import { IsString } from 'class-validator';

export class CreateEstadoCivilDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
