import { Module } from '@nestjs/common';
import { RegimeService } from './regime.service';
import { RegimeController } from './regime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regime } from './entities/regime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Regime])],
  controllers: [RegimeController],
  providers: [RegimeService],
})
export class RegimeModule {}
