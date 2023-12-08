import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'wow',
    });
  }

  async validate(payload: { email: string; userId: number }) {
    // this methods received valid token because the passport will do validation before invoke validate function
    // the return value will be in Requests object.
    const user = await this.usersService.findOneByID(payload.userId);
    return user;
  }
}
