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
  @PrimaryGeneratedColumn()
  articleID: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 3000 })
  content: string;

  @Column({ type: 'varchar', length: 150 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.articles, { onDelete: 'CASCADE' })
  author: User;
}
