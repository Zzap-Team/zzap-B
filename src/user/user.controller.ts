import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { User } from './schema/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/jwt/jwtAuth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':uid')
  getOne(@Param('uid') uid: string): Promise<User> {
    return this.userService.findOne(uid);
  }

  @Post()
  createUser(@Body() user: CreateUserDTO) {
    return this.userService.create(user);
  }

  @Delete(':uid')
  removeOne(@Param() uid: string): Promise<boolean> {
    return this.userService.delete(uid);
  }
}
