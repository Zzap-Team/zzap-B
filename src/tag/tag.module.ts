import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { ArticleModule } from 'src/article/article.module';
import { Tag } from '../model/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), forwardRef(() => ArticleModule)],
  providers: [TagService ,TagResolver],
  exports: [TagService],
})
export class TagModule {}
