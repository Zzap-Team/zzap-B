import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  //Primary Key & auto increment
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  @Exclude()
  hashedRefreshToken?: string;
}
