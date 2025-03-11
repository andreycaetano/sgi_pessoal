import { IsString } from 'class-validator';

export class CreateOrientacaoSexualDto {
  @IsString()
  name: string;
}
