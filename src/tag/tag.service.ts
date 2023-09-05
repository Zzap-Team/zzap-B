import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from 'src/model/tag.entity';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { Article } from 'src/model/article.entity';

@Injectable()
export class TagService {
    constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    ) {}

    async findByArticle(articleID: number): Promise<Tag[]> {
        return await this.tagRepository
          .createQueryBuilder('tag')
          .leftJoin('tag.articles', 'article')
          .where('articleID = :articleID', { articleID: articleID })
          .select('tag.name')
          .getMany();
    }

    async findOne(name: string): Promise<Tag> {
        const tag = await this.tagRepository.findOneBy({ name: name });
        if (tag) {
          return tag;
        } else
          throw new UserInputError('Can not found user at database', {
            data: 'User',
          });
    }

    async create(name: string): Promise<Tag> {
        const tag = await this.tagRepository.findOneBy({ name: name });
        if (tag) {
          return tag;
        } else{
            const newTag = new Tag();
            newTag.name = name;
            return await this.tagRepository.save(newTag);
        }
    }
    
    async delete(name: string): Promise<boolean> {
        try {
            await !!this.tagRepository.delete(name);
        } catch (e) {
            return false;
        }
        return true;
    }
}




