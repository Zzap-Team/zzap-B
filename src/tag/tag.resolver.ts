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
  import { Tag } from 'src/model/tag.model';
  import { TagService } from './tag.service';
  import { Article } from 'src/model/article.model';
import { ArticleService } from 'src/article/article.service';
  
  
  
@Resolver(() => Tag)
export class TagResolver {
constructor(private readonly tagService: TagService
    ,private readonly articleService: ArticleService) {}

    @Query(() => Tag, { name: 'tag' })
    async getTag(@Args('name') name: string) {
        const tag = await this.tagService.findOne(name);
        if (tag === null) {
            throw new UserInputError('Can not find tag', {
                argumentName: 'tagName',
            });
        }
        return tag;
    }

    @Mutation(() => Tag)
    async createTag(
        @Args('name') name: 
        string,
    ): Promise<Tag> {
        try {
        return await this.tagService.create(name);
        } catch (e) {
        throw new ApolloError(e);
        }
    }

    @Mutation((returns) => Boolean)
    async deleteTag(@Args('name') name: string): Promise<Boolean> {
        try {
        return await this.tagService.delete(name);
        } catch (e) {
        throw new ApolloError(e);
        }
    }

    // TODO: Apply Dataloader
    @ResolveField('articles', () => [Article], {nullable: true})
    async getArticles(@Parent() tag: Tag) {
        const { name } = tag;
        return await this.articleService.findByTag(name);
    }
}

