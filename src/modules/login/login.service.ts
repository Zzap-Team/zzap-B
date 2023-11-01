import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Login } from './login.entity';
import { UsersService } from '../users/users.service';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Login)
    private loginRepository: Repository<Login>,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  async loginWithGithub(authCode: string) {
    const { access_token: accessToken } = await lastValueFrom(
      this.httpService
        .get('https://github.com/login/oauth/access_token', {
          params: {
            code: authCode,
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
          },
          headers: {
            Accept: 'application/json',
          },
        })
        .pipe(map((res) => res.data)),
    );
    const emails = (await lastValueFrom(
      this.httpService
        .get('https://api.github.com/user/emails', {
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${accessToken}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
        .pipe(map((res) => res.data)),
    )) as Array<any>;
    const email: string = emails[0].email;
    const user = await this.usersService.findOneByEmail(email);
    if (user == null) {
      // TODO: 트랜잭션으로 묶어야 함
      const newUser = await this.usersService.create(
        email.slice(0, email.indexOf('@')),
        email,
      );
      await this.loginRepository.save({
        thirdParty: 'GITHUB',
        user: newUser,
      });
      return newUser;
    }
    return user;
  }
}
