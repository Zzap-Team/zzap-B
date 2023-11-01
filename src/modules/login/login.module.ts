import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './login.entity';
import { UsersModule } from '../users/users.module';
import { LoginResolver } from './login.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Login]), UsersModule, HttpModule],
  providers: [LoginService, LoginResolver],
  exports: [LoginService],
})
export class LoginModule {}
