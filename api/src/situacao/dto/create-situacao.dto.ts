import { IsString } from 'class-validator';

export class CreateSituacaoDto {
  @IsString()
  nome: string;
}
