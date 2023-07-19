// article typeorm model
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'article' })
export class Article {
  @PrimaryGeneratedColumn('uuid')
  articleID: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.articles, { onDelete: 'SET NULL' })
  author: User;
}
