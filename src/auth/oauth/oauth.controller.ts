import { Controller, Post, Body, Res, UseGuards, Get } from '@nestjs/common';
import { Response } from 'express';
import { OauthService } from './oauth.service';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import { RefreshGuard } from '../jwt/guard/jwtRefresh.guard';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post('github/signin')
  public async githubSignin(
    @Res({ passthrough: true }) res: Response,
    @Body() oauthSigninDTO: OauthSigninDTO,
  ) {
    const { user, accessToken, accessOption, refreshToken, refreshOption } =
      await this.oauthService.githubSignin(oauthSigninDTO);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);
    return user;
  }
}
