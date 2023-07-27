import { Field, ObjectType } from '@nestjs/graphql';
import { TokenInfo } from 'src/model/tokenInfo.model';

@ObjectType()
export class Tokens {
  @Field()
  accessToken: TokenInfo;

  @Field()
  refreshToken: TokenInfo;
}
