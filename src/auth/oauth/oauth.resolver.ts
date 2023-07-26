import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import { TokensDTO } from '../jwt/dto/tokens.dto';

@Resolver()
export class OauthResolver {
  constructor(private readonly oauthService: OauthService) {}

  @Mutation(() => TokensDTO)
  async signinWithGithub(
    @Args('oauthSigninDTO') oauthSigninDTO: OauthSigninDTO,
  ): Promise<TokensDTO> {
    try {
      const { statusCode, message, accessToken, refreshToken } =
        await this.oauthService.githubSignin(oauthSigninDTO);
      return {
        statusCode,
        message,
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
