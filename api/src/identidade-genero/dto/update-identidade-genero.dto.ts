import { PartialType } from '@nestjs/mapped-types';
import { CreateIdentidadeGeneroDto } from './create-identidade-genero.dto';

export class UpdateIdentidadeGeneroDto extends PartialType(CreateIdentidadeGeneroDto) {}
