import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoPcdDto } from './create-tipo-pcd.dto';

export class UpdateTipoPcdDto extends PartialType(CreateTipoPcdDto) {}
