import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { JwtAuthService } from './jwtAuth.service';
import { GqlAuthGurad } from './guard/gqlAuth.guard';
import { SignInDTO } from './dto/signIn.dto';
import { TokenInfo } from '../../model/tokenInfo.model';
import { GqlRefreshGurad } from './guard/gqlRefresh.guard';
import { AuthToken } from './decorator/AuthToken.decorator';
import { RefreshToken } from './decorator/RefreshToken.decorator';
import { Uid } from './decorator/uid.decorator';
import { TokensDTO } from './dto/tokens.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: JwtAuthService) {}

  @Mutation((returns) => TokensDTO)
  async signin(@Args('signInDTO') signInDTO: SignInDTO): Promise<TokensDTO> {
    try {
      const { statusCode, message, accessToken, refreshToken } =
        await this.authService.signIn(signInDTO);
      return {
        statusCode: statusCode,
        message: message,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation((returns) => TokenInfo)
  @UseGuards(GqlAuthGurad)
  async signout(@Uid() uid: string): Promise<TokenInfo> {
    return await this.authService.signOut(uid);
  }

  @Mutation((returns) => TokenInfo)
  @UseGuards(GqlRefreshGurad)
  async refreshToken(@RefreshToken() token: string): Promise<TokenInfo> {
    return await this.authService.getJwtAccessTokenWithRefresh(token);
  }
}
