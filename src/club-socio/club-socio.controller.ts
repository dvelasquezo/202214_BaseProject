import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';
  import { plainToInstance } from 'class-transformer';
  import { SocioEntity } from '../socio/socio.entity';
  import { SocioDto } from '../socio/socio.dto';
  import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
  import { ClubSocioService } from './club-socio.service';
  
  @Controller('clubs')
  @UseInterceptors(BusinessErrorsInterceptor)
  export class ClubSocioController {
    constructor(
      private readonly clubSocioService: ClubSocioService,
    ) {}
    @Post(':clubId/members/:memberId')
    async addMemberToClub(
      @Param('clubId') clubId: string,
      @Param('memberId') memberId: string,
    ) {
      return await this.clubSocioService.addMemberToClub(
        clubId,
        memberId,
      );
    }
  
    @Get(':clubId/members/:memberId')
    async findMemberFromClub(
      @Param('clubId') clubId: string,
      @Param('memberId') memberId: string,
    ) {
      return await this.clubSocioService.findMemberFromClub(
        memberId,
        clubId,
      );
    }
  
    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string) {
      return await this.clubSocioService.findMembersFromClub(
        clubId,
      );
    }
  
    @Put(':clubId/members')
    async updateMembersFromClub(
      @Body() socioDto: SocioDto[],
      @Param('clubId') clubId: string,
    ) {
      const socios = plainToInstance(SocioEntity, socioDto);
      return await this.clubSocioService.updateMembersFromClub(
        clubId,
        socios,
      );
    }
  
    @Delete(':clubId/members/:memberId')
    @HttpCode(204)
    async deleteMemberFromClub(
      @Param('clubId') clubId: string,
      @Param('memberId') memberId: string,
    ) {
      return await this.clubSocioService.deleteMemberFromClub(
        clubId,
        memberId,
      );
    }
  }
  