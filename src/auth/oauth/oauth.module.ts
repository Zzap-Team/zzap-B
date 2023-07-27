import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { OauthResolver } from './oauth.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
    UserModule,
  ],
  providers: [OauthService, OauthResolver],
})
export class OauthModule {}
