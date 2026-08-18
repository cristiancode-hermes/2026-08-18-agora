import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoriesRepository.find();
  }

  async findBySlug(slug: string) {
    return this.categoriesRepository.findOne({ where: { slug } });
  }
}
