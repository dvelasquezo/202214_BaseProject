/* eslint-disable prettier/prettier */
import { ClubEntity } from 'src/club/club.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class SocioEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombreUsuario: string;
 
 @Column()
 correoElectronico: string;
 
 @Column()
 fechaNacimiento: string;

 @ManyToMany(() => ClubEntity, club => club.socios)
 @JoinTable()
 clubes: ClubEntity[];
}