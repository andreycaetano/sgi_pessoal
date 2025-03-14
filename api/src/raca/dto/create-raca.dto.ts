import { IsString } from 'class-validator';

export class CreateRacaDto {
  @IsString()
  name: string;
}
