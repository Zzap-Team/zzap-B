// tag typeorm model
import {
    Entity,
    PrimaryColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Article } from './article.entity';
  
@Entity({ name: 'tag' })
export class Tag {
    @PrimaryColumn({ type: 'varchar', unique: true})
    name: string;

    @ManyToMany(() => Article, (article) => article.tags)
    articles: Article[];
}
