import { Module } from '@nestjs/common';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioController } from './socio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity])],
  providers: [SocioService],
  controllers: [SocioController]
})
export class SocioModule {}
