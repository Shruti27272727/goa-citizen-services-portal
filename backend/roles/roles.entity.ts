import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('roles')
export class Role {
 
  @PrimaryColumn()
  id: number; 

  @Column()
  role_type: string;
}
