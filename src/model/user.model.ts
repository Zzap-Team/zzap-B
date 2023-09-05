// user graphql model
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Article } from './article.model';

@ObjectType({ description: 'user' })
export class User {
  @Field(() => ID)
  uid: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field(() => [Article], { nullable: true })
  articles: Article[];

}
