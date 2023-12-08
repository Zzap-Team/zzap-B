import { Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { CurrentUser } from './current-user.decorator';
import { GqlJwtAuthGuard } from './gql-jwt-auth.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('refreshAccessToken')
  @UseGuards(GqlJwtAuthGuard)
  async refreshAccessToken(@CurrentUser() user: User) {
    return this.authService.signAccessToken(user);
  }
}
