import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignInDTO } from './dto/signIn.dto';
import { TokenInfo } from './model/tokenInfo.model';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const user = await this.vaildateUser(signInDTO);
    const { token: accessToken, ...accessOption } =
      await this.getJwtAccessToken(user.uid);
    const { token: refreshToken, ...refreshOption } =
      await this.getJwtRefreshToken(user.uid);
    await this.userService.setJwtRefreshToken(refreshToken, user.uid);
    //console.log('refreshToken', refreshToken);
    return { user, accessToken, accessOption, refreshToken, refreshOption };
  }

  async signOut(uid: string) {
    console.log('uid', uid);
    await this.userService.setJwtRefreshToken('', uid);
    return {
      token: '',
      httpOnly: true,
      maxAge: 0,
    };
  }

  async getJwtAccessTokenWithRefresh(jwtRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(jwtRefreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      const { uid } = payload;
      const temp = await this.userService.getUidIfRefreshTokenMatches(
        jwtRefreshToken,
        uid,
      );
      if (uid === temp) return this.getJwtAccessToken(uid);
      else throw new Error();
    } catch {
      throw new UnauthorizedException(
        'Your RefreshToken token does not exist or is expired. Please try sing in again',
      );
    }
  }

  private getJwtAccessToken(uid: String) {
    const payload = { uid };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    });
    return {
      token: token,
      httpOnly: true,
      maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) * 1000,
    };
  }

  private getJwtRefreshToken(uid: String) {
    const payload = { uid };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    });
    return {
      token: token,
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000,
    };
  }

  private async vaildateUser(signInDTO: SignInDTO): Promise<any> {
    const user = await this.userService.findOneByEmail(signInDTO.email);
    if (!user) throw new UnauthorizedException('can not find user');
    const isPasswordMatching = await bcrypt.compareSync(
      signInDTO.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
