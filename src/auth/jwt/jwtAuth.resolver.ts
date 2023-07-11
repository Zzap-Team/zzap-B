import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { AuthService } from './jwtAuth.service';
import { GqlAuthGurad } from './guard/gqlAuth.guard';
import { SignInDTO } from './dto/signIn.dto';
import { TokenInfo } from './model/tokenInfo.model';
import { GqlRefreshGurad } from './guard/gqlRefresh.guard';
import { AuthToken } from './decorator/AuthToken.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => TokenInfo)
  async signIn(@Args('signInDTO') signInDTO: SignInDTO): Promise<TokenInfo> {
    try {
      return this.authService.signIn(signInDTO);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query((returns) => String)
  @UseGuards(GqlAuthGurad)
  async testQuery(): Promise<String> {
    return 'dddd';
  }

  @Mutation((returns) => TokenInfo)
  @UseGuards(GqlAuthGurad)
  async signOut(): Promise<TokenInfo> {
    return await this.authService.signOut();
  }

  @Mutation((returns) => TokenInfo)
  @UseGuards(GqlRefreshGurad)
  async refreshToken(@AuthToken() token: string): Promise<TokenInfo> {
    console.log('token', token);
    return await this.authService.getJwtAccessTokenWithRefresh(token);
  }
}
