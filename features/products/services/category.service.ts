import { CategoryRepository } from "../repositories/category.repository";

export class CategoryService {
  private repo = new CategoryRepository();

  async getAllCategories() {
    return this.repo.findAll();
  }

  async getCategoryTree() {
    return this.repo.findTree();
  }

  async getCategoryBySlug(slug: string) {
    return this.repo.findBySlug(slug);
  }
}
