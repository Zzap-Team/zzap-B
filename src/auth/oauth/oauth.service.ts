import { Injectable } from '@nestjs/common';
import { OauthSigninDTO } from './dto/oauthSignin.dto';
import axios, { AxiosResponse } from 'axios';
import { GithubUserDTO } from './dto/githubUser.DTO';

@Injectable()
export class OauthService {
  public async getGithubInfo(
    oauthSigninDTO: OauthSigninDTO,
  ): Promise<GithubUserDTO> {
    const { code } = oauthSigninDTO;
    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';
    const request = {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
    };

    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json',
      },
    });
    if (response.data.error) {
      throw new Error('깃허브 인증을 실패했습니다.');
    }
    const { access_token } = response.data;
    const getUserUrl: string = 'https://api.github.com/user';
    // 깃허브 유저 조회 API 주소
    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
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
