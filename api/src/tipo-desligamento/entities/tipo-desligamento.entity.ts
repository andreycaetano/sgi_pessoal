import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tipo_desligamento' })
export class TipoDesligamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'date' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'date' })
  deletedAt: Date;
}
