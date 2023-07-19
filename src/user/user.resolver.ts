import {
  Query,
  Resolver,
  Args,
  Mutation,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { UseGuards } from '@nestjs/common';
import { User } from '../model/user.model';
import { Article } from 'src/model/article.model';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { Uid } from 'src/auth/jwt/decorator/uid.decorator';
import { GqlAuthGurad } from 'src/auth/jwt/guard/gqlAuth.guard';
import { ArticleService } from 'src/article/article.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  @Query(() => [User])
  async getUsers() {
    try {
      return this.userService.findAll();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query(() => User)
  async getUser(@Args('uid') uid: string): Promise<User> {
    try {
      return await this.userService.findOneByID(uid);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(GqlAuthGurad)
  @Query(() => User)
  async getMe(@Uid() uid: string): Promise<User> {
    try {
      return await this.userService.findOneByID(uid);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserDTO') createUserDTO: CreateUserDTO,
  ): Promise<User> {
    try {
      return await this.userService.create(createUserDTO);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(GqlAuthGurad)
  @Mutation(() => Boolean)
  async deleteUser(@Uid() uid: string): Promise<boolean> {
    try {
      return await this.userService.delete(uid);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  // TODO: Apply Dataloader
  @ResolveField(() => [Article])
  async getArticles(@Parent() user: User) {
    const { uid } = user;
    return await this.articleService.findAllByUid(uid);
  }
}
