import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { LoginWithThirdPartyInput } from 'src/graphql';

@Resolver('Login')
export class LoginResolver {
  constructor(private loginService: LoginService) {}

  @Mutation('loginWithThirdParty')
  async loginWithThirdParty(
    @Args('input') { vendor, authCode }: LoginWithThirdPartyInput,
  ) {
    if (vendor.toLowerCase() == 'github')
      return this.loginService.loginWithGithub(authCode);
  }
}
