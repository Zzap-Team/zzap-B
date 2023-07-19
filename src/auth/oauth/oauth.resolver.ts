import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';

@Resolver()
export class OauthResolver {
  constructor(private readonly oauthService: OauthService) {}

  @Mutation(() => String)
  async githubSignin(
    @Args('oauthSigninDTO') oauthSigninDTO: OauthSigninDTO,
  ): Promise<string> {
    try {
      const { user, accessToken } = await this.oauthService.githubSignin(
        oauthSigninDTO,
      );
      return accessToken;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
