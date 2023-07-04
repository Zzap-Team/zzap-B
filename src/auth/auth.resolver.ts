import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signIn.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query((returns) => String)
  async signIn(@Args('signInDTO') signInDTO: SignInDTO): Promise<String> {
    try {
      return this.authService.signIn(signInDTO);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
