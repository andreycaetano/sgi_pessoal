import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDesligamentoDto } from './create-tipo-desligamento.dto';

export class UpdateTipoDesligamentoDto extends PartialType(
  CreateTipoDesligamentoDto,
) {}
