// article graphql model
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Tag } from './tag.model';

@ObjectType({ description: 'article' })
export class Article {
  @Field(() => ID)
  articleID: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true})
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  author: User;

  @Field(() => [Tag], { nullable: true })
  tags: Tag[];
}
