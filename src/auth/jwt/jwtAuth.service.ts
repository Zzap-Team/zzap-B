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
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthService extends AuthService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService,
  ) {
    super(userService, jwtService);
  }

  async signIn(signInDTO: SignInDTO) {
    let statusCode = 200;
    let message = 'success';
    const user = await this.vaildateUser(signInDTO);
    const accessToken = await this.getJwtAccessToken(user.uid);
    const refreshToken = await this.getJwtRefreshToken(user.uid);
    await this.userService.setJwtRefreshToken(refreshToken.token, user.uid);

    return {
      statusCode,
      message,
      accessToken,
      refreshToken,
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
