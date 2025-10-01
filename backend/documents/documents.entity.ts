import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  fileName: string;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @ManyToOne(() => Application, (application) => application.documents, {
    nullable: false,
    onDelete: 'CASCADE', // Ensures documents are deleted when application is deleted
  })
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
