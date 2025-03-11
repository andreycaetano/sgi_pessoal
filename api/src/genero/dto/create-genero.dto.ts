import { IsString } from 'class-validator';

export class CreateGeneroDto {
  @IsString()
  name: string;
}
