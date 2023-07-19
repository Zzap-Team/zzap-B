import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';
import { User } from 'src/model/user.model';

@InputType()
export class CreateArticleDTO {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  content: string;
}
