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
import { AuthService } from './jwtAuth.service';
import { SignInDTO } from './dto/signIn.dto';
import { AuthGuard } from './guard/jwtAuth.guard';
import { RefreshGuard } from './guard/jwtRefresh.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  /*@HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDTO, @Res() res: Response) {
    const { token, ...option } = await this.authService.signIn(signInDto);
    console.log(token);
    console.log(option);
    res.cookie('Authentication', token, option);
    return;
  }*/

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.vaildateUser(signInDto);
    const { token: accessToken, ...accessOption } =
      await this.authService.signIn(user.uid);

    const { token: refreshToken, ...refreshOption } =
      this.authService.getJwtRefreshToken(user.uid);
    await this.userService.setJwtRefreshToken(refreshToken, user.uid);
    console.log(accessToken);
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
    //const user = await this.authService.getUserInfoWithAccessToken(req);
    const { token: accessToken, ...accessOption } =
      this.authService.getJwtAccessTokenWithRefresh(req.cookies?.Refresh);
    res.cookie('Authentication', accessToken, accessOption);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logOut(@Res({ passthrough: true }) res: Response) {
    const { token, ...option } = await this.authService.signOut();
    res.cookie('Authentication', token, option);
  }
}
