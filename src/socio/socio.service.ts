import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity';
import { Repository } from 'typeorm';
import {
    BusinessError,
    BusinessLogicException,
  } from '../shared/errors/business-errors';
@Injectable()
export class SocioService {
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async validarCorreoElectronico(correoElectronico: string): Promise<boolean> {
      if (correoElectronico.includes('@'))
        return true;
      return false;
    }

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubes"] });
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id}, relations: ["clubes"] } );
        if (!socio)
          throw new BusinessLogicException("El socio con el id no ha sido encontrado", BusinessError.NOT_FOUND);
   
        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        if(await this.validarCorreoElectronico(socio.correoElectronico) == false)
          throw new BusinessLogicException("El correo electronico no tiene @", BusinessError.PRECONDITION_FAILED);
        return await this.socioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
      if(await this.validarCorreoElectronico(socio.correoElectronico) == false)
        throw new BusinessLogicException("El correo electronico no tiene @", BusinessError.PRECONDITION_FAILED);
      const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});
      if (!persistedSocio)
        throw new BusinessLogicException("El socio con el id no ha sido encontrado", BusinessError.NOT_FOUND);
      
      return await this.socioRepository.save(socio);
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!socio)
          throw new BusinessLogicException("El socio con el id no ha sido encontrado", BusinessError.NOT_FOUND);
     
        await this.socioRepository.remove(socio);
    }
}
