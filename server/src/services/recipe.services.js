import { prisma } from "../prisma.js";

export const recipeService = {
  async getRecipes() {
    const recipes = await prisma.recipe.findMany({
      include: {
        category: true,
      },  
    });
    return recipes;
  }
};
