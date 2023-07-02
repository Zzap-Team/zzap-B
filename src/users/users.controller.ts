import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    console.log('getAll');
    return this.usersService.findAll();
  }

  @Get(':id')
  getOne(@Param() id: string): Promise<User> {
    console.log(`getOne ${id}`);
    return; // this.usersService.findOne(id);
  }

  @Post()
  createUser(@Body() user: CreateUserDTO) {
    console.log('cretaeUser', user);
    return; // this.usersService.createUser(user);
  }

  @Delete(':id')
  removeOne(@Param() id: string): Promise<void> {
    console.log(`removeOne ${id}`);
    return; //this.usersService.remove(id);
  }

  @Patch(':id')
  updateOne(@Param() id: string, @Body() user: UpdateUserDTO) {
    console.log(`updateOne ${id}`);
    return; // this.usersService.update(id, user);
  }
}
