import { Module } from '@nestjs/common';
import { TipoDesligamentoService } from './tipo-desligamento.service';
import { TipoDesligamentoController } from './tipo-desligamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDesligamento } from './entities/tipo-desligamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoDesligamento])],
  controllers: [TipoDesligamentoController],
  providers: [TipoDesligamentoService],
})
export class TipoDesligamentoModule {}
