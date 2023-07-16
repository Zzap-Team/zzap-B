import { Injectable } from '@nestjs/common';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import axios, { AxiosResponse } from 'axios';
import { GithubUserDTO } from './dto/githubUser.DTO';

@Injectable()
export class OauthService {
  private async getAccessToken(code: string): Promise<String> {
    // 민감한 정보를 query string으로 보내는게 맞을까?
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

  public async getGithubUserInfo(
    oauthSigninDTO: OauthSigninDTO,
  ): Promise<GithubUserDTO | void> {
    const { code } = oauthSigninDTO;
    const access_token = await this.getAccessToken(code);
    const getUserUrl: string = 'https://api.github.com/user';
    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const { login, avatar_url, node_id, created_at } = data;
    const githubInfo: GithubUserDTO = {
      githubId: login,
      avatar: avatar_url,
      uid: node_id,
      createdAt: created_at,
    };
    return githubInfo;
  }
}
