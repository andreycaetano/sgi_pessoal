import { IsString } from 'class-validator';

export class CreateRacaDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
