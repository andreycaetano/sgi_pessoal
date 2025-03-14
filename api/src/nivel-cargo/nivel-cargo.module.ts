import { Module } from '@nestjs/common';
import { NivelCargoService } from './nivel-cargo.service';
import { NivelCargoController } from './nivel-cargo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelCargo } from './entities/nivel-cargo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NivelCargo])],
  controllers: [NivelCargoController],
  providers: [NivelCargoService],
})
export class NivelCargoModule {}
