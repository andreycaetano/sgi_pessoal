import { IsString } from 'class-validator';

export class CreateIdentidadeGeneroDto {
  @IsString()
  name: string;
}
