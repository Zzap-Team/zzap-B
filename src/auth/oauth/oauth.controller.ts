import { Controller, Post, Body } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post('github')
  public async getGithubInfo(@Body() oauthSigninDTO: OauthSigninDTO) {
    const user = await this.oauthService.getGithubInfo(oauthSigninDTO);
    return {
      status: 200,
      message: '깃허브 유저 정보를 조회하였습니다.',
      data: {
        user,
      },
    };
  }
}
