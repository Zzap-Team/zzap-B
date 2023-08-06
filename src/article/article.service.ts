import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Article } from '../model/article.entity';
import { User } from 'src/model/user.entity';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { CreateArticleDTO } from './dto/createArticle.dto';

import { PaginatedArticles } from './article.resolver';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll(limit: number, cursor: number): Promise<PaginatedArticles> {
    
    const realLimit = Math.min(24, limit);
    if (cursor < 0) return { articles: [] };
    const articles = await this.articleRepository.find({
      relations: ['author'],
      take: realLimit,
      skip: cursor,
      order: {
        articleID: 'DESC',
      },
    });
    const newCursor = cursor + realLimit;
    return {
      articles: articles,
      cursor: newCursor,
    };
  }

  async findOne(articleID: number): Promise<Article> {
    return await this.articleRepository.findOne({
      where: { articleID: articleID },
      relations: ['author'],
    });
  }

  async findAllByUid(uid: number): Promise<Article[]> {
    console.log('uid', uid);
    return await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.author = :uid', { uid: uid })
      .orderBy('article.author', 'DESC')
      .getMany();
  }

  async create(
    uid: number,
    CreateArticleDTO: CreateArticleDTO,
  ): Promise<Article> {
    const newArticle = new Article();
    //newArticle.articleID = uuid();
    newArticle.title = CreateArticleDTO.title;
    newArticle.content = CreateArticleDTO.content;
    newArticle.description = CreateArticleDTO.description;
    const user = new User();
    user.uid = uid;
    newArticle.author = user;
    newArticle.createdAt = new Date();
    newArticle.updatedAt = new Date();
    return await this.articleRepository.save(newArticle);
  }

  async delete(articleID: string): Promise<boolean> {
    try {
      await !!this.articleRepository.delete(articleID);
    } catch (e) {
      return false;
    }
    return true;
  }

  async update(articleID: number, article: UpdateArticleDTO): Promise<Article> {
    try {
      const temp = await this.articleRepository.update(articleID, {
        content: article.content,
        title: article.content,
        description: article.description,
        updatedAt: new Date(),
      });
      console.log(temp);
      return await this.findOne(articleID);
    } catch (e) {
      throw new Error(e);
    }
  }
}
