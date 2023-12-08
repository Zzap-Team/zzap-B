import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private usersService: UsersService,
  ) {}

  async findOneById(id: number) {
    return await this.articleRepository.findOneBy({ articleId: id });
  }

  async create(
    authorId: number,
    title: string,
    content: string,
    description: string,
  ) {
    const user = await this.usersService.findOneByID(authorId);
    if (user == null) throw new Error('user is not exsist.');
    return await this.articleRepository.save({
      author: user,
      title,
      content,
      description,
    });
  }

  async delete(id: number) {
    const dest = await this.articleRepository.findOneBy({ articleId: id });
    if (dest == null) throw new Error('The aritle is not exist.');
    const result = await this.articleRepository.remove(dest);
    console.log(result);
    return !!!result;
  }

  async update(
    id: number,
    title: string,
    content: string,
    description: string,
  ) {
    const article = await this.articleRepository.findOneBy({ articleId: id });
    if (article == null) throw new Error('');
    article.title = title ?? article.title;
    article.content = content ?? article.content;
    article.description = description ?? article.description;
    await this.articleRepository.save(article);
    return await this.articleRepository.findOneBy({ articleId: id });
  }
}
