/* eslint-disable prettier/prettier */
import { SocioEntity } from 'src/socio/socio.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany,JoinTable } from 'typeorm';

@Entity()
export class ClubEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 fechaFundacion: string;
 
 @Column()
 imagen: string;
 
 @Column()
 descripcion: string;

 @ManyToMany(() => SocioEntity, socio => socio.clubes)
 @JoinTable()
 socios: SocioEntity[];
}