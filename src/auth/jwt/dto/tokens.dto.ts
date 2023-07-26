import { Field, ObjectType } from '@nestjs/graphql';
import { TokenInfo } from 'src/model/tokenInfo.model';

@ObjectType()
export class TokensDTO {
  @Field()
  statusCode: number;

  @Field()
  message: string;

  @Field()
  accessToken: TokenInfo;

  @Field()
  refreshToken: TokenInfo;
}
