import { IsString } from 'class-validator';

export class CreateTipoDesligamentoDto {
  @IsString()
  name: string;
}
