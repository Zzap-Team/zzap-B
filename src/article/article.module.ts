import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleService } from './article.service';
import { Article } from '../model/article.entity';
import { ArticleResolver } from './article.resolver';
import { UserModule } from 'src/user/user.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), forwardRef(() => UserModule), TagModule],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
