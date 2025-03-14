import { IsString } from 'class-validator';

export class CreateSituacaoDto {
  @IsString({ message: 'name é obrigatório' })
  nome: string;
}
