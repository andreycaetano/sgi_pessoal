import { Module } from '@nestjs/common';
import { UsuarioTipoService } from './usuario-tipo.service';
import { UsuarioTipoController } from './usuario-tipo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioTipo } from './entities/usuario-tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioTipo])],
  controllers: [UsuarioTipoController],
  providers: [UsuarioTipoService],
})
export class UsuarioTipoModule {}
