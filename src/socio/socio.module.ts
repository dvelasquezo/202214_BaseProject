import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';

@Module({
  providers: [SocioService]
})
export class SocioModule {}
