import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './login.entity';
import { UsersModule } from '../users/users.module';
import { LoginResolver } from './login.resolver';
import { HttpModule } from '../http/http.module';

@Module({
  imports: [TypeOrmModule.forFeature([Login]), UsersModule, HttpModule],
  providers: [LoginService, LoginResolver],
  exports: [LoginService],
})
export class LoginModule {}
