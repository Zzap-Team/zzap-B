import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { SignInDTO } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDTO: SignInDTO): Promise<any> {
    const user = await this.userService.findOneByEmail(signInDTO.email);
    if (user?.password !== signInDTO.password) {
      throw new UnauthorizedException();
    }
    const payload = { uid: user.uid, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verify(jwtString: string) {
    try {
      const payload = await this.jwtService.verifyAsync(jwtString, {
        secret: process.env.JWT_SECRET,
      });
      console.log('verify', payload);
      const { uid, name } = payload;
      return {
        uid: uid,
        name: name,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
