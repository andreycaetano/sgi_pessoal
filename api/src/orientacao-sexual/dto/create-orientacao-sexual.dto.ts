import { IsString } from 'class-validator';

export class CreateOrientacaoSexualDto {
  @IsString({ message: 'name é obrigatório' })
  name: string;
}
