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
    const { statusCode, accessToken, refreshToken } =
      await this.oauthService.githubSignin(oauthSigninDTO);
    res.cookie('Authentication', accessToken.token, {
      httpOnly: accessToken.httpOnly,
      maxAge: accessToken.maxAge,
    });
    res.cookie('Refresh', refreshToken.token, {
      httpOnly: refreshToken.httpOnly,
      maxAge: refreshToken.maxAge,
    });
    return statusCode;
  }
}
