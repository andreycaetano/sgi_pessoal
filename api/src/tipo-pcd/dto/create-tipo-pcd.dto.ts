import { IsString } from 'class-validator';

export class CreateTipoPcdDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
