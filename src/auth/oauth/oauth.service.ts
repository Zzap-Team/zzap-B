import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError, ApolloError } from 'apollo-server-express';
import axios, { AxiosResponse } from 'axios';

import { OauthSigninDTO } from './dto/oauthSignin.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/model/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class OauthService extends AuthService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService,
  ) {
    super(userService, jwtService);
  }

  public async githubSignin(oauthSigninDTO: OauthSigninDTO) { // return => {access, refresh, user}
    const { code } = oauthSigninDTO;
    let access_token = '';
    try {
      access_token = await this.getAccessToken(code);
    } catch (e) { // fail github authentication to code
      console.log('error', e);
      throw e;
    }
    const getUserUrl: string = 'https://api.github.com/user';
    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const { login, avatar_url, email, node_id, created_at } = data;

    let user: User = new User();
    if (email === null) {
      throw new ApolloError(
        'User Email does not exist. Please signin to anothor method.',
        'NONEXISTENT_VALUE',
        { argumentName: 'email' },
      );
    }
    user = await this.userService.findOneByEmail(email);
    if (!user) {
      user = await this.userService.createWithUid(
        {
          name: login,
          email: email,
          password: null,
        },
        node_id,
      );
    }
    const accessToken = await this.getJwtAccessToken(user.uid);
    const refreshToken = await this.getJwtRefreshToken(user.uid);
    await this.userService.setJwtRefreshToken(refreshToken, user.uid);
    return {
      accessToken,
      refreshToken,
      user
    };
  }

  private async getAccessToken(code: string): Promise<string> {
    // 민감한 정보(client secret)를 query string으로 보내는게 맞을까?
    const getTokenUrl: string = `https://github.com/login/oauth/access_token?code=${code}&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`;
    const response: AxiosResponse = await axios.post(
      getTokenUrl,
      {},
      {
        headers: {
          accept: 'application/json',
        },
        responseType: 'json',
      },
    );
    if (response.data.error) {
      switch (response.data.error) {
        case 'bad_verification_code':
          throw new AuthenticationError('github Code is expired', {
            code: 'EXPIRED',
          });
        default:
          throw new AuthenticationError('fail github authentication!!', {
            code: 'INTERNAL_SERVER_ERROR',
          });
      }
    }
    const { access_token } = response.data;
    return access_token;
  }
}
