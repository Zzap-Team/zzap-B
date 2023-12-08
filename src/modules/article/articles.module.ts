import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { ArticlesResolver } from './articles.resolver';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UsersModule, JwtModule],
  providers: [ArticlesService, ArticlesResolver],
  exports: [ArticlesService],
})
export class ArticlesModule {}
