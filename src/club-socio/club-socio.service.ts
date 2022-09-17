/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';

@Injectable()
export class ClubSocioService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,

        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) { }

    async valClubSocio(clubId: string, socio: SocioEntity): Promise<ClubEntity> {
        if (!socio)
            throw new BusinessLogicException(
                'El socio con el id no ha sido encontrado',
                BusinessError.NOT_FOUND,
            );
        const club: ClubEntity =
            await this.clubRepository.findOne({
                where: { id: `${clubId}` },
                relations: ['socios'],
            });
        if (!club)
            throw new BusinessLogicException(
                'El club con el id no ha sido encontrado',
                BusinessError.NOT_FOUND,
            );
        return club;
    }

    async valAsocClubSocio(club: ClubEntity, socio: SocioEntity): Promise<SocioEntity> {
        const clubSocio: SocioEntity =
            club.socios.find(
                (e) => e.id === socio.id,
            );
        if (!clubSocio)
            throw new BusinessLogicException(
                'El socio con el id no esta asociado al club',
                BusinessError.PRECONDITION_FAILED,
            );
        return clubSocio;
    }

    async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socioId } });
        if (!socio)
            throw new BusinessLogicException("El socio con el id no ha sido encontrado", BusinessError.NOT_FOUND);

        const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ["socios"] })
        if (!club)
            throw new BusinessLogicException("El club con el id no ha sido encontrado", BusinessError.NOT_FOUND);

        club.socios = [...club.socios, socio];
        return await this.clubRepository.save(club);
    }

    async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
        const club: ClubEntity =
            await this.clubRepository.findOne({
                where: { id: `${clubId}` },
                relations: ['socios'],
            });
        if (!club)
            throw new BusinessLogicException(
                'El club con el id no ha sido encontrado',
                BusinessError.NOT_FOUND,
            );
        return club.socios;
    }

    async findMemberFromClub(memberId: string, clubId: string): Promise<SocioEntity> {
        const socio: SocioEntity =
            await this.socioRepository.findOne({
                where: { id: `${memberId}` },
            });
        const club = await this.valClubSocio(
            clubId,
            socio,
        );
        return this.valAsocClubSocio(
            club,
            socio,
        );
    }

    async deleteMemberFromClub(
        clubId: string,
        memberId: string,
      ) {
        const socio: SocioEntity =
            await this.socioRepository.findOne({
                where: { id: `${memberId}` },
            });
        if (!socio)
          throw new BusinessLogicException("El socio con el id no ha sido encontrado", BusinessError.NOT_FOUND)
    
        const club: ClubEntity = await this.clubRepository.findOne({where: { id: `${clubId}` }, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("El club con el id no ha sido encontrado", BusinessError.NOT_FOUND)
    
        const socioDelClub: SocioEntity = club.socios.find(e => e.id === socio.id);
    
        if (!socioDelClub)
            throw new BusinessLogicException("El socio con el id no esta asociado al club", BusinessError.PRECONDITION_FAILED)
 
        club.socios = club.socios.filter(e => e.id !== memberId);
        await this.clubRepository.save(club);
      }


      async updateMembersFromClub(clubId: string, socios: SocioEntity[],
      ): Promise<ClubEntity> {
        const club: ClubEntity =
          await this.clubRepository.findOne({
            where: { id: `${clubId}` },
            relations: ['socios'],
          });
        if (!club)
          throw new BusinessLogicException(
            'El club con el id no ha sido encontrado',
            BusinessError.NOT_FOUND,
          );
        for (let i = 0; i < socios.length; i++) {
          const socio: SocioEntity =
            await this.socioRepository.findOne({
              where: { id: `${socios[i].id}` },
            });
          if (!socio)
            throw new BusinessLogicException(
              'El socio con el id no ha sido encontrado',
              BusinessError.NOT_FOUND,
            );
        }
        club.socios = socios;
        return await this.clubRepository.save(club);
      }
    
}