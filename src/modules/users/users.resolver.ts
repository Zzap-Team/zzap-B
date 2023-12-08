import { UseFilters } from '@nestjs/common';
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { AddUserInput } from './dto/addUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { UseGuards } from '@nestjs/common/decorators';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './user.entity';
import { GqlValidationExceptionFilter } from '../GQLExceptionFilter';

@Resolver('User')
@UseFilters(GqlValidationExceptionFilter)
export class UsersResolver {
  constructor(private usersService: UsersService) {}
  @Query('me')
  @UseGuards(GqlJwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return this.usersService.findOneByID(user.userId);
  }

  @Mutation('deleteMe')
  @UseGuards(GqlJwtAuthGuard)
  async deleteMe(@CurrentUser() user: User) {
    const deletedUser = await this.usersService.delete(user.userId);
    return !!deletedUser;
  }

  @Mutation('updateMe')
  @UseGuards(GqlJwtAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('input') { name, email }: UpdateUserInput,
  ) {
    return this.usersService.update(user.userId, name!, email);
  }
}
