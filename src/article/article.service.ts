import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Article } from '../model/article.entity';
import { User } from 'src/model/user.entity';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { CreateArticleDTO } from './dto/createArticle.dto';

import { PaginatedArticles } from './article.resolver';
import { Tag } from 'src/model/tag.entity';


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
    return await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.author = :uid', { uid: uid })
      .orderBy('article.author', 'DESC')
      .getMany();
  }

  async findByTag(name: string) : Promise<Article[]> {

   return await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('name = :name', { name: name })
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

  async delete(articleID: number): Promise<boolean> {
    try {
      await !!this.articleRepository.delete(articleID);
    } catch (e) {
      return false;
    }
    return true;
  }

  async update(articleID: number, article: UpdateArticleDTO): Promise<Article> {
    try {
      console.log(articleID);
      const temp = await this.articleRepository.update(articleID, {
        content: article.content,
        title: article.title,
        description: article.description,
        updatedAt: new Date(),
      });
      
      return await this.findOne(articleID);
    } catch (e) {
      throw new Error(e);
    }
  }

  async addTag(article: Article, tags: Tag[]){
    article.tags = tags;
    return await this.articleRepository.save(article); 
  }
}
