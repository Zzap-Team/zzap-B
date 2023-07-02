import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
