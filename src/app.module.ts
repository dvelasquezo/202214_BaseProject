import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { SocioClubModule } from './socio-club/socio-club.module';
import { ClubSocioModule } from './club-socio/club-socio.module';
import { ClubEntity } from './club/club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './socio/socio.entity';

@Module({
  imports: [SocioModule, ClubModule, SocioClubModule, ClubSocioModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'clubs',
    entities: [ClubEntity, SocioEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
