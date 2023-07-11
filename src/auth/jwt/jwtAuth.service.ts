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

  async vaildateUser(signInDTO: SignInDTO): Promise<any> {
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

  async getUserInfoWithAccessToken(req: Request): Promise<any> {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer')
      throw new UnauthorizedException('Can not find access token');
    try {
      const { uid } = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      return await this.userService.findOneByID(uid);
    } catch {
      throw new UnauthorizedException('Your access token is expired');
    }
  }

  async signIn(signInDTO: SignInDTO) {
    const user = await this.userService.findOneByEmail(signInDTO.email);
    if (!user) throw new UnauthorizedException();
    const isPasswordMatching = await bcrypt.compareSync(
      signInDTO.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    return await this.getJwtAccessToken(user.uid);
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

  getJwtRefreshToken(uid: String) {
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

  getJwtAccessTokenWithRefresh(jwtRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(jwtRefreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      const { uid } = payload;
      return this.getJwtAccessToken(uid);
    } catch {
      throw new UnauthorizedException(
        'Your RefreshToken token does not exist or is expired',
      );
    }
  }

  async signOut() {
    return {
      token: '',
      httpOnly: true,
      maxAge: 0,
    };
  }

  async verify(jwtString: string) {
    try {
      const payload = await this.jwtService.verifyAsync(jwtString, {
        secret: process.env.JWT_SECRET,
      });
      const { uid, name } = payload;
      return {
        uid: uid,
        name: name,
      };
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
