import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Genero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: `varchar` })
  name: string;

  @CreateDateColumn({ name: `created_at` })
  createdAt: Date;

  @UpdateDateColumn({ name: `updated_at` })
  updatedAt: Date;

  @DeleteDateColumn({ name: `deleted_at` })
  deletedAt: Date;
}
