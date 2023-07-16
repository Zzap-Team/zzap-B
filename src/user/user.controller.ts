import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { User } from '../model/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/jwt/guard/jwtAuth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':uid')
  getUser(@Param('uid') uid: string): Promise<User> {
    return this.userService.findOneByID(uid);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createUser(@Body() user: CreateUserDTO) {
    return this.userService.create(user);
  }

  @Delete(':uid')
  removeOne(@Param() uid: string): Promise<boolean> {
    return this.userService.delete(uid);
  }
}
