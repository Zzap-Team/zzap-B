import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/configuration';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<EnvironmentVariables>,
  ) {}

  async signAccessToken(user: User) {
    return this.jwtService.sign(
      { email: user.email, userId: user.userId },
      {
        expiresIn: this.config.get('auth.access.expiresIn', { infer: true }),
      },
    );
  }

  async signRefreshToken(user: User) {
    return this.jwtService.sign(
      { email: user.email, userId: user.userId },
      {
        expiresIn: this.config.get('auth.refresh.expiresIn', { infer: true }),
      },
    );
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verify(token);
  }

  async verifyRefreshToken(token: string) {
    return this.jwtService.verify(token);
  }
}
