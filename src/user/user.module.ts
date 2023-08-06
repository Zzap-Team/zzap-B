import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../model/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ArticleModule)],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
