import {
  Query,
  Resolver,
  Args,
  Mutation,
  ResolveField,
  Parent,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { Article } from '../model/article.model';
import { ArticleService } from './article.service';
import { GqlAuthGurad } from 'src/auth/guard/gqlAuth.guard';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { Uid } from 'src/auth/jwt/decorator/uid.decorator';
import { User } from 'src/model/user.model';


@ObjectType()
export class PaginatedArticles {
  @Field(() => [Article])
  articles: Article[];

  @Field(() => Number, { nullable: true })
  cursor?: Article['articleID'] | null;
}

@Resolver((returns) => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query((returns) => PaginatedArticles, { name: 'articles' })
  async getArticles(
    @Args('limit', { nullable: true, defaultValue: 6 }) limit: number,
    @Args('cursor', { nullable: true, defaultValue: 0 }) cursor: number): 
  Promise<PaginatedArticles> {
    try {
      console.log(limit, cursor);
      const temp = await this.articleService.findAll(limit, cursor);
      console.log(temp);
      return temp;
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Query((returns) => Article, { name: 'article' })
  async getArticle(@Args('articleID') articleID: number) {
    const article = await this.articleService.findOne(articleID);
    if (article === null) {
      throw new UserInputError('Can not find article for articleID', {
        argumentName: 'articleID',
      });
    }
    return article;
  }

  @UseGuards(GqlAuthGurad)
  @Mutation((returns) => Article)
  async createArticle(
    @Args('createArticleDTO') createArticleDTO: CreateArticleDTO,
    @Uid() uid: number,
  ): Promise<Article> {
    try {
      return await this.articleService.create(uid, createArticleDTO);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(GqlAuthGurad)
  @Mutation((returns) => Article)
  async updateArticle(
    @Args('updateArticleDTO') updateArticleDTO: UpdateArticleDTO,
    @Args('articleID') articleID: number,
  ): Promise<Article> {
    try {
      return await this.articleService.update(articleID, updateArticleDTO);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @UseGuards(GqlAuthGurad)
  @Mutation((returns) => Boolean)
  async deleteArticle(@Args('articleID') articleID: number): Promise<Boolean> {
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
