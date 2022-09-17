import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { Repository } from 'typeorm';
import {
    BusinessError,
    BusinessLogicException,
  } from '../shared/errors/business-errors';
@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}

    async validarLimiteDescripcion(descripcion: string): Promise<boolean> {
      if (descripcion.length < 100)
        return true;
      return false;
    }  

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["socios"] });
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id}, relations: ["socios"] } );
        if (!club)
          throw new BusinessLogicException("El club con el id no ha sido encontrado", BusinessError.NOT_FOUND);
   
        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {
      if(await this.validarLimiteDescripcion(club.descripcion) == false)
        throw new BusinessLogicException("La descripcion supera el limite de caracteres", BusinessError.PRECONDITION_FAILED);
      return await this.clubRepository.save(club);
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const persistedClub: ClubEntity = await this.clubRepository.findOne({where:{id}});

        if(await this.validarLimiteDescripcion(club.descripcion) == false)
          throw new BusinessLogicException("La descripcion supera el limite de caracteres", BusinessError.PRECONDITION_FAILED);

        if (!persistedClub)
          throw new BusinessLogicException("El club con el id no ha sido encontrado", BusinessError.NOT_FOUND);

        return await this.clubRepository.save(club);
    }

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club)
          throw new BusinessLogicException("El club con el id no ha sido encontrado", BusinessError.NOT_FOUND);
     
        await this.clubRepository.remove(club);
    }
}
