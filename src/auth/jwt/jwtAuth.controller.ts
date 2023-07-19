import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthService } from './jwtAuth.service';
import { SignInDTO } from './dto/signIn.dto';
import { AuthGuard } from './guard/jwtAuth.guard';
import { RefreshGuard } from './guard/jwtRefresh.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInDTO: SignInDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, accessOption, refreshToken, refreshOption } =
      await this.jwtAuthService.signIn(signInDTO);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);
    return user;
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token: accessToken, ...accessOption } =
      await this.jwtAuthService.getJwtAccessTokenWithRefresh(
        req.cookies?.Refresh,
      );
    res.cookie('Authentication', accessToken, accessOption);
  }

  @UseGuards(AuthGuard)
  @Post('signout')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const uid = req['uid'];
    const { token, ...option } = await this.jwtAuthService.signOut(uid);
    res.cookie('Authentication', token, option);
  }
}
