
import { Field, ObjectType } from '@nestjs/graphql';
import { Article } from './article.model';

@ObjectType({ description: 'tag' })
export class Tag {
  @Field()
  name: string;

  @Field(() => [Article], { nullable: true })
  articles: Article[];
}
