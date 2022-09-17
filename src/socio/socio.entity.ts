/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}