// article graphql model
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType({ description: 'article' })
export class Article {
  @Field(() => ID)
  articleID: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  author: User;
}
