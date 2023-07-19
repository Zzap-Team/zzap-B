import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';

@Resolver()
export class OauthResolver {
  constructor(private readonly oauthService: OauthService) {}

  @Mutation(() => Boolean)
  async signinWithGithub(
    @Args('oauthSigninDTO') oauthSigninDTO: OauthSigninDTO,
  ): Promise<boolean> {
    try {
      const { user, accessToken, accessOption, refreshToken, refreshOption } =
        await this.oauthService.githubSignin(oauthSigninDTO);
      return true;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
