import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService,
  ) {}

  async signOut(uid: string) {
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

  protected getJwtAccessToken(uid: String) {
    const payload = { uid };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    });
    return {
      token: token,
      httpOnly: true,
      maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    };
  }

  protected getJwtRefreshToken(uid: String) {
    const payload = { uid };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    });
    return {
      token: token,
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    };
  }
}
