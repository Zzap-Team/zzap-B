import { Controller, Post, Body } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post('github')
  public async getGithubUserInfo(@Body() oauthSigninDTO: OauthSigninDTO) {
    const user = await this.oauthService.getGithubUserInfo(oauthSigninDTO);
    return {
      status: 200,
      message: '[get] github user info',
      data: {
        user,
      },
    };
  }
}
