import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post('github/signin')
  public async githubSignin(
    @Res({ passthrough: true }) res: Response,
    @Body() oauthSigninDTO: OauthSigninDTO,
  ) {
    const { user, accessToken } = await this.oauthService.githubSignin(
      oauthSigninDTO,
    );
    res.cookie('Authentication', accessToken);
    return user;
  }
}
