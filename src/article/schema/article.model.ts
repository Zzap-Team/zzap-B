import { Field, ID, ObjectType } from '@nestjs/graphql';

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
}
