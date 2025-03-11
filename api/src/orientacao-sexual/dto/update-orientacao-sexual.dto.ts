import { PartialType } from '@nestjs/mapped-types';
import { CreateOrientacaoSexualDto } from './create-orientacao-sexual.dto';

export class UpdateOrientacaoSexualDto extends PartialType(CreateOrientacaoSexualDto) {}
