import { recipeService } from "../services/recipe.services.js";
import cloudinary from "../config/cloudinary.config.js";

export const recipeController = {
  async getRecipes(req, res) {
    const result = await recipeService.getRecipes();
    return res.ok(result);
  },
  async getRecipeById(req, res) {
    const recipeId = Number(req.params.id);
    const result = await recipeService.getRecipeById(recipeId);
    if (!result) return res.notFound("Recipe not found");
    return res.ok(result);
  },
  async create(req, res) {
    let imageUrl = null;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "recipes",
      });
      imageUrl = uploadResult.secure_url;
    }

    let ingredients = req.body.ingredients;
    if (typeof ingredients === "string") {
      ingredients = JSON.parse(ingredients);
    }

    let steps = req.body.steps;
    if (typeof steps === "string") {
      steps = JSON.parse(steps);
    }
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
  async favourite(req, res) {
    const result = await recipeService.toggleFavourite(req.params.id, true);
    return res.ok(result);
  },
  async unfavourite(req, res) {
    const result = await recipeService.toggleFavourite(req.params.id, false);
    return res.ok(result);
  },
  async delete(req, res) {
    await recipeService.delete(req.params.id);
    return res.ok({ message: "Recipe deleted successfully" });
  },
  async update(req, res) {
    let imageUrl = null;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "recipes",
      });
      imageUrl = uploadResult.secure_url;
    }

    let ingredients = req.body.ingredients;
    if (typeof ingredients === "string") {
      ingredients = JSON.parse(ingredients);
    }

    let steps = req.body.steps;
    if (typeof steps === "string") {
      steps = JSON.parse(steps);
    }

    const data = {
      title: req.body.title,
      prepTime: req.body.prepTime ? Number(req.body.prepTime) : null,
      cookTime: req.body.cookTime ? Number(req.body.cookTime) : null,
      servings: req.body.servings ? Number(req.body.servings) : null,
      spiciness: req.body.spiciness ? Number(req.body.spiciness) : null,
      difficulty: req.body.difficulty || null,
      note: req.body.note || null,
      categoryId: req.body.category ? Number(req.body.category) : null,
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

    // Only add imageUrl if new image was uploaded
    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    const result = await recipeService.update(req.params.id, data);
    return res.ok(result);
  },
};
