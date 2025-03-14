import { Module } from '@nestjs/common';
import { SituacaoService } from './situacao.service';
import { SituacaoController } from './situacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Situacao } from './entities/situacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Situacao])],
  controllers: [SituacaoController],
  providers: [SituacaoService],
})
export class SituacaoModule {}
