import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';

import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import { SigninInfo } from '../../model/signinInfo.model';
import { Response } from '../jwt/decorator/Response.decorator';



@Resolver()
export class OauthResolver {
  constructor(private readonly oauthService: OauthService) {}

  @Mutation(() => SigninInfo)
  async signinWithGithub(
    @Args('oauthSigninDTO') oauthSigninDTO: OauthSigninDTO,
    @Response() res,
  ): Promise<SigninInfo> {
    try {
      const { accessToken, refreshToken, user } =
        await this.oauthService.githubSignin(oauthSigninDTO);
      res.cookie('Refresh', refreshToken,{httpOnly: true});
      //res.cookie.setHttpOnly(true);
      return {
        accessToken: accessToken,
        user: user
      };
    } catch (e) {
      throw e;
    }
  }
}
