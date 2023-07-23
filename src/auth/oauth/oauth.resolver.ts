import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import { tokenInfoDTO } from '../jwt/dto/tokenInfo.dto';

@Resolver()
export class OauthResolver {
  constructor(private readonly oauthService: OauthService) {}

  @Mutation(() => tokenInfoDTO)
  async signinWithGithub(
    @Args('oauthSigninDTO') oauthSigninDTO: OauthSigninDTO,
  ): Promise<tokenInfoDTO> {
    try {
      const { user, accessToken, accessOption, refreshToken, refreshOption } =
        await this.oauthService.githubSignin(oauthSigninDTO);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
