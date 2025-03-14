import { IsString } from 'class-validator';

export class CreateTipoPcdDto {
  @IsString()
  name: string;
}
