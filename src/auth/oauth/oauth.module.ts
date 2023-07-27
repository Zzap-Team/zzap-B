import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { OauthResolver } from './oauth.resolver';

@Module({
  imports: [UserModule],
  providers: [OauthService, OauthResolver],
})
export class OauthModule {}
