import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class SigninInfo {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
