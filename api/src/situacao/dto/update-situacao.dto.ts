import { PartialType } from '@nestjs/mapped-types';
import { CreateSituacaoDto } from './create-situacao.dto';

export class UpdateSituacaoDto extends PartialType(CreateSituacaoDto) {}
