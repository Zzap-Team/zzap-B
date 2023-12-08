import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Login } from '../login/login.entity';
import { Article } from '../article/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ unique: true })
  email: string;

  @Column({ length: 20 })
  name: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Login, (login) => login.user, { cascade: true })
  logins: Login[];

  @OneToMany(() => Article, (article) => article.author, { eager: true })
  articles: Article[];
}
