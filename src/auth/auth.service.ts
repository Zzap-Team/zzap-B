import { Injectable } from '@nestjs/common';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService, 
  ) {}

  async signOut(uid: number): Promise<string> {
    await this.userService.setJwtRefreshToken('', uid);
    return '';
  }

  async getJwtAccessTokenWithRefresh(jwtRefreshToken: string) {
    let uid = -1;
    try {
      const payload = this.jwtService.verify(jwtRefreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      uid = payload.uid;
    } catch (e) {
      throw new ApolloError('Refresh token is expired', 'EXPIRED', {
        argumentName: 'refreshToken',
      });
    }
    const temp = await this.userService.getUidIfRefreshTokenMatches(
      jwtRefreshToken,
      uid,
    );
    if (!temp)
      throw new AuthenticationError('RefreshToken token does not exist');
    if (uid === temp) return this.getJwtAccessToken(uid);
    else throw new AuthenticationError('RefreshToken token get damaged');
  }

  protected getJwtAccessToken(uid: number) : string{
    const payload = { uid };
    try {
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
      });
      return token;
    } catch (e) {
      throw new AuthenticationError('Your access token is expired');
    }
  }

  protected getJwtRefreshToken(uid: number): string {
    const payload = { uid };
    try {
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
      });
      return token;
    } catch (e) {
       throw new AuthenticationError('Your access token is expired');
    }
  }
}
