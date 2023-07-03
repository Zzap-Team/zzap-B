import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'article' })
export class Article {
  //Primary Key & auto increment
  @PrimaryGeneratedColumn('uuid')
  articleID: string;

  // DOTO: ManyToOne Relation implement
  //author: User;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
