import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

 @Column({ name: 'file_name' })
fileName: string;

@Column({ name: 'file_path' })
filePath: string;


  @ManyToOne(() => Application, app => app.documents)
  @JoinColumn({ name: 'application_id' }) 
  application: Application;
}
