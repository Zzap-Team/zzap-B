import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { LoginWithThirdPartyInput } from 'src/graphql';
import { Response } from 'express';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/configuration';

@Resolver('Login')
export class LoginResolver {
  constructor(
    private loginService: LoginService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Mutation('loginWithThirdParty')
  async loginWithThirdParty(
    @Context('res') res: Response,
    @Args('input') { vendor, authCode }: LoginWithThirdPartyInput,
  ) {
    if (vendor.toLowerCase() == 'github') {
      const { accessToken, refreshToken, user } =
        await this.loginService.loginWithGithub(authCode);
      res.cookie('REFRESH_TOKEN', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: ms(
          this.config.get('auth.refresh.expiresIn', { infer: true }) as string,
        ),
      });
      return {
        accessToken,
        user,
      };
    }
  }
}
