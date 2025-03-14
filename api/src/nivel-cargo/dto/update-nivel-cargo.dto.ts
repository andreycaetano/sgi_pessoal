import { PartialType } from '@nestjs/mapped-types';
import { CreateNivelCargoDto } from './create-nivel-cargo.dto';

export class UpdateNivelCargoDto extends PartialType(CreateNivelCargoDto) {}
