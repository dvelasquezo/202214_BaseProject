import { Module } from '@nestjs/common';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity])],
  providers: [SocioService]
})
export class SocioModule {}
