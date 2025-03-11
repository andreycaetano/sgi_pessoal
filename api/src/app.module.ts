import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EstadoCivilModule } from './estado-civil/estado-civil.module';
import { GeneroModule } from './genero/genero.module';
import { IdentidadeGeneroModule } from './identidade-genero/identidade-genero.module';
import { OrientacaoSexualModule } from './orientacao-sexual/orientacao-sexual.module';

@Module({
  imports: [
    DatabaseModule,
    EstadoCivilModule,
    GeneroModule,
    IdentidadeGeneroModule,
    OrientacaoSexualModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
