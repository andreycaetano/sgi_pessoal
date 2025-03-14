import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioTipoDto } from './create-usuario-tipo.dto';

export class UpdateUsuarioTipoDto extends PartialType(CreateUsuarioTipoDto) {}
