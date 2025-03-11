import { Module } from '@nestjs/common';
import { IdentidadeGeneroService } from './identidade-genero.service';
import { IdentidadeGeneroController } from './identidade-genero.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentidadeGenero } from './entities/identidade-genero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdentidadeGenero])],
  controllers: [IdentidadeGeneroController],
  providers: [IdentidadeGeneroService],
})
export class IdentidadeGeneroModule {}
