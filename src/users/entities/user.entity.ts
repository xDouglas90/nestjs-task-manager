import {
  BaseEntity,
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
    length: 50,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    length: 50,
  })
  lastName: string;

  @Column({
    length: 255,
  })
  email: string;

  @Column({
    length: 100,
  })
  password: string;

  @Column()
  salt: string;

  @Column({ type: 'varchar', length: 64, name: 'confirm_token', default: null })
  confirmationToken: string;

  @Column({ type: 'varchar', length: 64, name: 'recover_token', default: null })
  recoverToken: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', default: null })
  deletedAt: Date;

  @BeforeInsert()
  generatedId() {
    if (this.id) return;

    this.id = uuidv4();
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
