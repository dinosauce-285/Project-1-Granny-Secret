import { recipeService } from "../services/recipe.services.js";
export const recipeController = {
  async getRecipes(req, res) {
    const result = await recipeService.getRecipes();
    return res.ok(result);
  }
}