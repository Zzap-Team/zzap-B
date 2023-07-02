import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  //Primary Key & auto increment
  @PrimaryGeneratedColumn()
  uid: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  createdAt: string; // DOTO: change string type to Date type
}
