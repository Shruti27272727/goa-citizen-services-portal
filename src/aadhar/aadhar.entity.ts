import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('aadhar')
export class Aadhar {
  @PrimaryGeneratedColumn({ type: 'integer' })
  citizen_id: number; // auto-increment

  @Column({ type: 'text' })
  aadhar_number: string;

  @Column({ type: 'date' })
  dob: string;

  @Column({ type: 'text', nullable: true })
  gender: string;
}
