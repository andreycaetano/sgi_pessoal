import { IsString } from 'class-validator';

export class CreateTipoDesligamentoDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
