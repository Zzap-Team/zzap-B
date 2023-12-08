import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './login.entity';
import { UsersModule } from '../users/users.module';
import { LoginResolver } from './login.resolver';
import { HttpModule } from '../http/http.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Login, User]),
    UsersModule,
    AuthModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [LoginService, LoginResolver],
  exports: [LoginService],
})
export class LoginModule {}
