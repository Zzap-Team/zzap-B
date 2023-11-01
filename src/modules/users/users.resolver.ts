import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { AddUserInput } from './dto/addUser.input';
import { UpdateUserInput } from './dto/updateUser.input';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('user')
  async getUser(@Args('id') id: number) {
    return this.usersService.findOneByID(id);
  }

  @Mutation('addUser')
  async addUser(@Args('input') { name, email }: AddUserInput) {
    return this.usersService.create(name, email);
  }

  @Mutation('deleteUser')
  async deleteUser(@Args('id') id: number) {
    const deletedUser = await this.usersService.delete(id);
    return !!!deletedUser.deletedAt;
  }

  @Mutation('updateUser')
  async updateUser(
    @Args('id') id: number,
    @Args('input') { name, email }: UpdateUserInput,
  ) {
    return this.usersService.update(id, name, email);
  }
}
