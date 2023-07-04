import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { Article } from './schema/article.entity';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleResolver: ArticleResolver,
  ) {}

  @Get()
  getAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get(':articleID')
  getOne(@Param('articleID') articleID: string): Promise<Article | void> {
    return this.articleService.findOne(articleID);
  }

  @Post()
  create(@Body() article: CreateArticleDTO) {
    console.log(article);
    return this.articleService.create(article);
  }

  @Delete(':articleID')
  delete(@Param() articleID: string): Promise<boolean> {
    return this.articleService.delete(articleID);
  }

  @Patch(':articleID')
  update(@Param() articleID: string, @Body() article: UpdateArticleDTO) {
    return this.articleService.update(articleID, article);
  }
}
