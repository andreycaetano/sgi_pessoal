import { Module } from '@nestjs/common';
import { OrientacaoSexualService } from './orientacao-sexual.service';
import { OrientacaoSexualController } from './orientacao-sexual.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrientacaoSexual } from './entities/orientacao-sexual.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrientacaoSexual])],
  controllers: [OrientacaoSexualController],
  providers: [OrientacaoSexualService],
})
export class OrientacaoSexualModule {}
