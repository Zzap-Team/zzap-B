import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'tokenInfo' })
export class TokenInfo {
  @Field()
  token: string;

  @Field()
  httpOnly: boolean;

  @Field()
  maxAge: number;
}
