// user typeorm model
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Article } from './article.entity';

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

  @OneToMany((type) => Article, (article) => article.author, { nullable: true })
  articles: Article[];
}
