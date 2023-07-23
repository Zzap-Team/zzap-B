import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class tokenInfoDTO {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
