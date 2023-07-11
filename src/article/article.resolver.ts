import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Article } from './schema/article.model';
import { ApolloError } from 'apollo-server-express';
import { ArticleService } from './article.service';
import { GqlAuthGurad } from 'src/auth/jwt/guard/gqlAuth.guard';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';

@Resolver()
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query((returns) => [Article])
  async getArticles() {
    try {
      return this.articleService.findAll();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query((returns) => Article)
  async getArticle(@Args('articleID') articleID: string) {
    try {
      return await this.articleService.findOne(articleID);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(GqlAuthGurad)
  @Mutation((returns) => Article)
  async createArticle(
    @Args('createArticleDTO') createArticleDTO: CreateArticleDTO,
  ): Promise<Article> {
    try {
      console.log(createArticleDTO);
      return await this.articleService.create(createArticleDTO);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(GqlAuthGurad)
  @Mutation((returns) => Boolean)
  async updateArticle(
    @Args('updateArticleDTO') updateArticleDTO: UpdateArticleDTO,
    @Args('articleID') articleID: string,
  ): Promise<Boolean> {
    try {
      return await this.articleService.update(articleID, updateArticleDTO);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(GqlAuthGurad)
  @Mutation((returns) => Boolean)
  async deleteArticle(@Args('articleID') articleID: string): Promise<Boolean> {
    try {
      return await this.articleService.delete(articleID);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
