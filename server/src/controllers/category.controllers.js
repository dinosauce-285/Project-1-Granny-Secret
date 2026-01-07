import { categoryService } from "../services/category.services.js";
export const categoryController = {
  async getCategories(req, res) {
    const result = await categoryService.getCategories();
    return res.ok(result);
  }
}