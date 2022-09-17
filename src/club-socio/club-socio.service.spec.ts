import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ClubSocioService } from './club-socio.service';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();
    service = module.get<ClubSocioService>(
      ClubSocioService,
    );
    clubRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    socioRepository = module.get<
      Repository<SocioEntity>
    >(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity =
        await socioRepository.save({
          nombreUsuario: faker.company.name(), 
          correoElectronico: faker.internet.email(), 
          fechaNacimiento: faker.date.birthdate().toString()
        });
        sociosList.push(socio);
    }
    club = await clubRepository.save({
      nombre: faker.company.name(), 
      fechaFundacion: faker.date.past().toString(), 
      imagen: faker.image.imageUrl(), 
      descripcion: faker.lorem.sentence(),
      socios: sociosList
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMembersToClub should add member to a club', async () => {
    const newClub: ClubEntity =
      await clubRepository.save({
        nombre: faker.company.name(), 
        fechaFundacion: faker.date.past().toString(), 
        imagen: faker.image.imageUrl(), 
        descripcion: faker.lorem.sentence()
      });
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.company.name(), 
      correoElectronico: faker.internet.email(), 
      fechaNacimiento: faker.date.birthdate().toString()
    });
    const result: ClubEntity =
      await service.addMemberToClub(
        newClub.id,
        newSocio.id,
      );
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombreUsuario).toBe(newSocio.nombreUsuario);
    expect(result.socios[0].correoElectronico).toBe(newSocio.correoElectronico);
  });


  it('findMembersFromClub should return members from club', async () => {
    const socios: SocioEntity[] =
      await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5);
  });

  it('findMemberFromClub should return member from club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity =
      await service.findMemberFromClub(
        socio.id,
        club.id
      );
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toBe(socio.nombreUsuario);
    expect(storedSocio.correoElectronico).toBe(socio.correoElectronico);
  });

  it('updateMembersFromClub should update a members list for a club', async () => {
    const newSocio: SocioEntity =
      await socioRepository.save({
        nombreUsuario: faker.company.name(), 
        correoElectronico: faker.internet.email(), 
        fechaNacimiento: faker.date.birthdate().toString()
      });
    const updatedClub: ClubEntity =
      await service.updateMembersFromClub(club.id, [
        newSocio,
      ]);
    expect(updatedClub.socios.length).toBe(1);
    expect(updatedClub.socios[0].nombreUsuario).toBe(newSocio.nombreUsuario);
    expect(updatedClub.socios[0].correoElectronico).toBe(newSocio.correoElectronico);
  });

  it('deleteMemberFromClub should remove a member from a club', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.deleteMemberFromClub(
      club.id,
      socio.id,
    );
    const storedClub: ClubEntity =
      await clubRepository.findOne({
        where: { id: `${club.id}` },
        relations: ['socios'],
      });
    const deletedMember: SocioEntity = storedClub.socios.find((a) => a.id === socio.id);
    expect(deletedMember).toBeUndefined();
  });
});
