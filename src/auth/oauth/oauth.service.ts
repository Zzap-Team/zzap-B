import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import axios, { AxiosResponse } from 'axios';
import { UserService } from 'src/user/user.service';
import { User } from 'src/model/user.entity';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OauthService extends AuthService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService,
  ) {
    super(userService, jwtService);
  }

  public async githubSignin(oauthSigninDTO: OauthSigninDTO) {
    let statusCode = 200;
    let message = 'success';
    const { code } = oauthSigninDTO;
    let access_token = '';
    try {
      access_token = await this.getAccessToken(code);
    } catch (e) {
      statusCode = 410;
      return {
        statusCode: statusCode,
        message: 'Code is expired. please request code to github server.',
        accessToken: { token: '', httpOnly: true, maxAge: 0 },
        refreshToken: { token: '', httpOnly: true, maxAge: 0 },
      };
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
      throw new HttpException(
        'User Email does not exist. please signin to anothor method.',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      user = await this.userService.findOneByEmail(email);
    } catch (exception) {
      if (exception.status == 404) {
        user = await this.userService.createWithUid(
          {
            name: login,
            email: email,
            password: null,
          },
          node_id,
        );
      }
    }

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
          throw new HttpException('Your Code is expired', HttpStatus.GONE);
        default:
          throw new Error('Error: fail github authentication!!');
      }
    }
    const { access_token } = response.data;
    return access_token;
  }
}
