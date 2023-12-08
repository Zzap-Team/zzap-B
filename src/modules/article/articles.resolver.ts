import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ArticlesService } from './articles.service';
import { ArticleInput } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@Resolver('Article')
export class ArticlesResolver {
  constructor(private articlesService: ArticlesService) {}

  @Query('article')
  async getArticle(@Args('articleId') id: number) {
    return this.articlesService.findOneById(id);
  }

  @Mutation('addArticle')
  @UseGuards(GqlJwtAuthGuard)
  async addArticle(
    @CurrentUser() user: User,
    @Args('input') input: ArticleInput,
  ) {
    return this.articlesService.create(
      user.userId,
      input.title!,
      input.content!,
      input.description!,
    );
  }

  @Mutation('deleteArticle')
  @UseGuards(GqlJwtAuthGuard)
  async deleteArticle(
    @CurrentUser() user: User,
    @Args('articleId') id: number,
  ) {
    const article = user.articles.find((article) => article.articleId === id);
    if (article == null) throw new Error('it is not your article');
    const wow = await this.articlesService.delete(id);
    console.log(wow);
    return wow;
  }

  @Mutation('updateArticle')
  @UseGuards(GqlJwtAuthGuard)
  async updateArticle(
    @CurrentUser() user: User,
    @Args('articleId') id: number,
    @Args('input') input: ArticleInput,
  ) {
    // need to check owner of article.
    const article = user.articles.find((article) => article.articleId === id);
    if (article == null) throw new Error('it is not your article');
    return this.articlesService.update(
      id,
      input.title!,
      input.content!,
      input.description!,
    );
  }
}
