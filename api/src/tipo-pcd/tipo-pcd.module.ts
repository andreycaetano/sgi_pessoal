import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TipoPcdService } from './tipo-pcd.service';
import { TipoPcdController } from './tipo-pcd.controller';
import { TipoPcd } from './entities/tipo-pcd.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoPcd])],
  controllers: [TipoPcdController],
  providers: [TipoPcdService],
})
export class TipoPcdModule {}
