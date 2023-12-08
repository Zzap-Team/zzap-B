import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Login } from './login.entity';
import { UsersService } from '../users/users.service';
import { HttpService } from '../http/http.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/configuration';
import { User } from '../users/user.entity';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  async loginWithGithub(authCode: string) {
    const email = await this.getGithubEmail(authCode);
    let user = await this.usersService.findOneByEmail(email, true);
    console.log('check', user);
    if (user == null) {
      // 회원등록
      // TODO: 트랜잭션으로 묶어야 함
      const name = email.slice(0, email.indexOf('@'));
      user = this.usersRepository.create({ name, email });
      const login = this.loginRepository.create({ user, thirdParty: 'GITHUB' });
      user.logins = [login];
      user = await this.usersRepository.save(user);
    } else if (user.deletedAt) {
      user = await this.usersRepository.recover(user);
    }

    const accessToken = await this.authService.signAccessToken(user);
    const refreshToken = await this.authService.signRefreshToken(user);
    return { user, accessToken, refreshToken };
  }

  private async getGithubEmail(authCode: string) {
    const { access_token: accessTokenGithub } = await this.httpService.get(
      'https://github.com/login/oauth/access_token',
      {
        params: {
          code: authCode,
          client_id: this.config.get('thirdParty.github.clientId', {
            infer: true,
          }),
          client_secret: this.config.get('thirdParty.github.clientSecret', {
            infer: true,
          }),
        },
        headers: {
          Accept: 'application/vnd.github+json',
        },
      },
    );
    const emails = (await this.httpService.get(
      'https://api.github.com/user/emails',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${accessTokenGithub}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    )) as Array<any>;
    return emails[0].email;
  }
}
