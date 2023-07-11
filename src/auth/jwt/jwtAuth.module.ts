import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './jwtAuth.service';
import { AuthController } from './jwtAuth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthResolver } from './jwtAuth.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      //signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, AuthResolver],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
