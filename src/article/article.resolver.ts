import {
  Query,
  Resolver,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Article } from '../model/article.model';
import { ApolloError } from 'apollo-server-express';
import { ArticleService } from './article.service';
import { GqlAuthGurad } from 'src/auth/jwt/guard/gqlAuth.guard';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { Uid } from 'src/auth/jwt/decorator/uid.decorator';
import { User } from 'src/model/user.model';

@Resolver((returns) => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query((returns) => [Article], { name: 'articles' })
  async getArticles() {
    try {
      return this.articleService.findAll();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query((returns) => Article, { name: 'article' })
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
    @Uid() uid: string,
  ): Promise<Article> {
    try {
      console.log(createArticleDTO);
      return await this.articleService.create(uid, createArticleDTO);
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

  // TODO: Apply Dataloader
  @ResolveField('author', (returns) => User)
  async getAuthor(@Parent() article: Article) {
    const author = article.author;
    return author;
  }
}
