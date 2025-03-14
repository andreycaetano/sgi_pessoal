import { IsString } from 'class-validator';

export class CreateRegimeDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
