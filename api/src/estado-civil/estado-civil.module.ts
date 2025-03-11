import { Module } from '@nestjs/common';
import { EstadoCivilService } from './estado-civil.service';
import { EstadoCivilController } from './estado-civil.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoCivil } from './entities/estado-civil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstadoCivil])],
  controllers: [EstadoCivilController],
  providers: [EstadoCivilService],
  exports: [EstadoCivilService],
})
export class EstadoCivilModule {}
