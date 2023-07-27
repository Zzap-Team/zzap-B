import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import { Tokens } from '../../model/tokens.model';

@Resolver()
export class OauthResolver {
  constructor(private readonly oauthService: OauthService) {}

  @Mutation(() => Tokens)
  async signinWithGithub(
    @Args('oauthSigninDTO') oauthSigninDTO: OauthSigninDTO,
  ): Promise<Tokens> {
    try {
      const { accessToken, refreshToken } =
        await this.oauthService.githubSignin(oauthSigninDTO);
      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }
}
