import { IsString } from 'class-validator';

export class CreateEstadoCivilDto {
  @IsString()
  name: string;
}
