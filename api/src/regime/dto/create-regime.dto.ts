import { IsString } from 'class-validator';

export class CreateRegimeDto {
  @IsString()
  name: string;
}
