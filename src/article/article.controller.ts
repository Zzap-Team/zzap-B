import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { ArticleService } from './article.service';
import { Article } from '../model/article.entity';
import { AuthGuard } from 'src/auth/guard/jwtAuth.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  getArticles(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get(':articleID')
  getArticle(@Param('articleID') articleID: string): Promise<Article | void> {
    return this.articleService.findOne(articleID);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: Request, @Body() article: CreateArticleDTO) {
    console.log(article);
    const uid = req['uid'];
    return this.articleService.create(uid, article);
  }

  @UseGuards(AuthGuard)
  @Delete(':articleID')
  delete(@Param() articleID: string): Promise<boolean> {
    return this.articleService.delete(articleID);
  }

  @UseGuards(AuthGuard)
  @Patch(':articleID')
  update(
    @Param() articleID: string,
    @Body() article: UpdateArticleDTO,
  ): Promise<boolean> {
    return this.articleService.update(articleID, article);
  }
}
