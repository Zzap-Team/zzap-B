import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto';
import { ArticleService } from './article.service';
import { Article } from './article.entity';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
    return this.articleService.create(article);
  }

  @Delete(':articleID')
  delete(@Param() articleID: string): Promise<void> {
    return this.articleService.delete(articleID);
  }

  @Patch(':articleID')
  update(@Param() articleID: string, @Body() article: CreateArticleDTO) {
    return this.articleService.update(articleID, article);
  }
}
