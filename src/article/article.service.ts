import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Article } from './article.entity';
import { CreateArticleDTO } from './dto/create-article.dto';
import { UpdateArticleDTO } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  findAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  async findOne(articleID: string): Promise<Article | void> {
    return await this.articleRepository.findOneBy({ articleID: articleID });
  }

  async create(CreateArticleDTO: CreateArticleDTO): Promise<void> {
    const newArticle = new Article();
    newArticle.articleID = uuidv4();
    console.log(newArticle.articleID);
    newArticle.title = CreateArticleDTO.title;
    newArticle.content = CreateArticleDTO.content;
    newArticle.createdAt = new Date();
    newArticle.updatedAt = new Date();
    await this.articleRepository.save(newArticle);
  }

  async delete(articleID: string): Promise<void> {
    await this.articleRepository.delete(articleID);
  }

  async update(articleID: string, article: UpdateArticleDTO) {
    /* update query를 날릴 때 save를 사용하지 않는 이유
         => save는 select query와 update query 둘 다 날림 -> 느려
        */
    await this.articleRepository.update(articleID, {
      content: article.content,
      title: article.content,
      updatedAt: new Date(),
    });
  }
}
