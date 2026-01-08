import { recipeService } from "../services/recipe.services.js";
export const recipeController = {
  async getRecipes(req, res) {
    const result = await recipeService.getRecipes();
    return res.ok(result);
  },
  async create(req, res) {
    const data = req.body;  
    const result = await recipeService.create(data);
    return res.ok(result);  
  }
}