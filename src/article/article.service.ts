import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Article } from '../model/article.entity';
import { User } from 'src/model/user.entity';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { CreateArticleDTO } from './dto/createArticle.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  findAll(): Promise<Article[]> {
    return this.articleRepository.find({ relations: ['author'] });
  }

  async findOne(articleID: string): Promise<Article | void> {
    return await this.articleRepository.findOne({
      where: { articleID: articleID },
      relations: ['author'],
    });
  }

  async findAllByUid(uid: string): Promise<Article[]> {
    console.log('uid', uid);
    return await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.author = :uid', { uid: uid })
      .orderBy('article.author', 'DESC')
      .getMany();
  }

  async create(
    uid: string,
    CreateArticleDTO: CreateArticleDTO,
  ): Promise<Article> {
    const newArticle = new Article();
    newArticle.articleID = uuidv4();
    newArticle.title = CreateArticleDTO.title;
    newArticle.content = CreateArticleDTO.content;
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

  async update(articleID: string, article: UpdateArticleDTO): Promise<boolean> {
    try {
      return !!(await this.articleRepository.update(articleID, {
        content: article.content,
        title: article.content,
        updatedAt: new Date(),
      }));
    } catch (e) {
      return false;
    }
  }
}
