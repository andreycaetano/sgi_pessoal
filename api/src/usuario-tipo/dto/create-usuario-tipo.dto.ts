import { IsString } from 'class-validator';

export class CreateUsuarioTipoDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;

  @IsString({ message: 'sistema é obrigatório' })
  sistema: string;

  @IsString({ message: 'descricao é obrigatório' })
  descricao: string;
}
