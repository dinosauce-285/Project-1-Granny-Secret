import { prisma } from "../prisma.js";

export const categoryService = {
  async getCategories() {
    const categories = await prisma.category.findMany({});
    return categories;
  }
};
