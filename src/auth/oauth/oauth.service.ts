import { Injectable, HttpException } from '@nestjs/common';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import axios, { AxiosResponse } from 'axios';
import { UserService } from 'src/user/user.service';
import { User } from 'src/model/user.entity';

@Injectable()
export class OauthService {
  constructor(private userService: UserService) {}

  public async githubSignin(oauthSigninDTO: OauthSigninDTO) {
    const { code } = oauthSigninDTO;
    const accessToken = await this.getAccessToken(code);
    const getUserUrl: string = 'https://api.github.com/user';
    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { login, avatar_url, email, node_id, created_at } = data;
    /*const githubInfo: GithubUserDTO = {
      githubId: login,
      avatar: avatar_url,
      uid: node_id,
      createdAt: created_at,
      email: email,
    };*/
    let user: User = new User();
    console.log(accessToken, login);
    try {
      user = await this.userService.findOneByName(login);
    } catch (exception) {
      console.log(exception);
      if (exception.status == 404) {
        user = await this.userService.create({
          name: login,
          email: email,
          password: null,
        });
      }
    }

    await this.userService.setOauthToken(accessToken, user.uid);
    return { user, accessToken };
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
      throw new Error('Error: fail github authentication!!');
    }
    const { access_token, refresh_token } = response.data;
    return access_token;
  }
}
