/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    socioList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
        nombreUsuario: faker.company.name(), 
        correoElectronico: faker.internet.email(), 
        fechaNacimiento: faker.date.birthdate().toString(), 
      })
        socioList.push(socio);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedSocio: SocioEntity = socioList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombreUsuario).toEqual(storedSocio.nombreUsuario)
    expect(socio.correoElectronico).toEqual(storedSocio.correoElectronico)
    expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
  });

  it('findOne should throw an exception for an invalid member', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El socio con el id no ha sido encontrado")
  });

  it('create should return a new member', async () => {
    const socio: SocioEntity = {
      id: "",
      nombreUsuario: faker.company.name(), 
      correoElectronico: faker.internet.email(), 
      fechaNacimiento: faker.date.birthdate().toString(), 
      clubes: [],
    }

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}})
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(newSocio.nombreUsuario)
    expect(storedSocio.correoElectronico).toEqual(newSocio.correoElectronico)
    expect(storedSocio.fechaNacimiento).toEqual(newSocio.fechaNacimiento)
  });

  it('update should modify a member', async () => {
    const socio: SocioEntity = socioList[0];
    socio.nombreUsuario = "New nombre";
    socio.correoElectronico = "test@test.com";
  
    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();
  
    const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(socio.nombreUsuario)
    expect(storedSocio.correoElectronico).toEqual(socio.correoElectronico)
  });
 
  it('update should throw an exception for an invalid member', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio, nombreUsuario: "New nombre", correoElectronico: "test@test.com"
    }
    await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "El socio con el id no ha sido encontrado")
  });

  it('delete should remove a member', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
  
    const deletedMember: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(deletedMember).toBeNull();
  });

  it('delete should throw an exception for an invalid member', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El socio con el id no ha sido encontrado")
  });
 
});