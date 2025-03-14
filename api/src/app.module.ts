import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EstadoCivilModule } from './estado-civil/estado-civil.module';
import { GeneroModule } from './genero/genero.module';
import { IdentidadeGeneroModule } from './identidade-genero/identidade-genero.module';
import { OrientacaoSexualModule } from './orientacao-sexual/orientacao-sexual.module';
import { RacaModule } from './raca/raca.module';
import { RegimeModule } from './regime/regime.module';
import { SituacaoModule } from './situacao/situacao.module';
import { TipoDesligamentoModule } from './tipo-desligamento/tipo-desligamento.module';
import { TipoPcdModule } from './tipo-pcd/tipo-pcd.module';
import { NivelCargoModule } from './nivel-cargo/nivel-cargo.module';
import { UsuarioTipoModule } from './usuario-tipo/usuario-tipo.module';

@Module({
  imports: [
    DatabaseModule,
    EstadoCivilModule,
    GeneroModule,
    IdentidadeGeneroModule,
    OrientacaoSexualModule,
    RacaModule,
    RegimeModule,
    TipoDesligamentoModule,
    SituacaoModule,
    TipoPcdModule,
    NivelCargoModule,
    UsuarioTipoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
