import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthService } from './jwtAuth.service';
import { GqlAuthGurad } from '../guard/gqlAuth.guard';
import { SignInDTO } from './dto/signIn.dto';
import { GqlRefreshGurad } from '../guard/gqlRefresh.guard';
import { RefreshToken } from './decorator/RefreshToken.decorator';
import { Uid } from './decorator/uid.decorator';
import { SigninInfo } from '../../model/signinInfo.model';
import { Response } from './decorator/Response.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: JwtAuthService) {}

  @Mutation((returns) => SigninInfo)
  async signin(@Args('signInDTO') signInDTO: SignInDTO): Promise<SigninInfo> {
    try {
      const { accessToken, user } = await this.authService.signIn(signInDTO );
      return {
        accessToken: accessToken,
        user: user
      };
    } catch (e) {
      throw e;
    }
  }

  @Mutation((returns) => Boolean)
  @UseGuards(GqlAuthGurad)
  async signout(@Uid() uid: number,  @Response() res,): Promise<boolean> {
    try{
      const refresh = await this.authService.signOut(uid);
      res.cookie('Refresh', refresh, {httpOnly: true});
    
      return true;
    } catch(e){
      // signout 실패 에러 던지기
      throw new Error(e);
    }
  }

  // get access token with refresh token
  @Mutation((returns) => String)
  @UseGuards(GqlRefreshGurad)
  async getAccessToken(@RefreshToken() token: string): Promise<String> {
    return await this.authService.getJwtAccessTokenWithRefresh(token);
  }
}
