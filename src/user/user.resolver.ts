import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { User } from './schema/user.model';
import { ApolloError } from 'apollo-server-express';
import { UserService } from './user.service';

import { CreateUserDTO } from './dto/createUser.dto';
//import { userLoginDTO } from './dto/userLogin.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => [User])
  async getUsers() {
    try {
      return this.userService.findAll();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query((returns) => User)
  async getUser(@Args('uid') uid: string) {
    try {
      return await this.userService.findOne(uid);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation((returns) => User)
  async createUser(
    @Args('createUserDTO') createUserDTO: CreateUserDTO,
  ): Promise<User> {
    try {
      return await this.userService.create(createUserDTO);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation((returns) => Boolean)
  async deleteUser(@Args('uid') uid: string): Promise<boolean> {
    try {
      return await this.userService.delete(uid);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
