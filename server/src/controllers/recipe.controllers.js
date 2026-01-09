import { recipeService } from "../services/recipe.services.js";
import cloudinary from "../config/cloudinary.config.js";

export const recipeController = {
  async getRecipes(req, res) {
    const result = await recipeService.getRecipes();
    return res.ok(result);
  },
  async create(req, res) {
    let imageUrl = null;

    // Upload image to Cloudinary if file exists
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "recipes",
      });
      imageUrl = uploadResult.secure_url;
    }

    // Parse JSON strings from FormData
    let ingredients = req.body.ingredients;
    if (typeof ingredients === "string") {
      ingredients = JSON.parse(ingredients);
    }

    let steps = req.body.steps;
    if (typeof steps === "string") {
      steps = JSON.parse(steps);
    }

    // Transform data
    const data = {
      title: req.body.title,
      imageUrl: imageUrl,
      prepTime: req.body.prepTime ? Number(req.body.prepTime) : null,
      cookTime: req.body.cookTime ? Number(req.body.cookTime) : null,
      servings: req.body.servings ? Number(req.body.servings) : null,
      spiciness: req.body.spiciness ? Number(req.body.spiciness) : null,
      difficulty: req.body.difficulty || null,
      note: req.body.note || null,
      categoryId: req.body.category ? Number(req.body.category) : null,
      userId: 1, // TODO: Replace with actual user from auth
      ingredients: ingredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount ? Number(ing.amount) : null,
        unit: ing.unit || null,
      })),
      steps: steps.map((step, index) => ({
        stepOrder: index + 1,
        content: step,
      })),
    };

    const result = await recipeService.create(data);
    return res.ok(result);
  },
};
