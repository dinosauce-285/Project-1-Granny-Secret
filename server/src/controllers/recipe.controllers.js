import { recipeService } from "../services/recipe.services.js";
import cloudinary from "../config/cloudinary.config.js";

export const recipeController = {
  async getRecipes(req, res) {
    const filters = {
      categoryId: req.query.category,
      favourite: req.query.favourite,
      saved: req.query.saved,
    };
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const result = await recipeService.getRecipes(
      filters,
      req.user?.userId,
      page,
      limit,
    );
    return res.ok(result);
  },
  async getMyRecipes(req, res) {
    const filters = {
      userId: req.user.userId,
      categoryId: req.query.category,
      favourite: req.query.favourite,
    };
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const result = await recipeService.getRecipes(
      filters,
      req.user?.userId,
      page,
      limit,
    );
    return res.ok(result);
  },
  async getRecipeById(req, res) {
    const recipeId = Number(req.params.id);
    const result = await recipeService.getRecipeById(
      recipeId,
      req.user?.userId,
    );
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
      userId: req.user.userId,
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
    const result = await recipeService.toggleLike(
      req.user.userId,
      req.params.id,
    );
    return res.ok(result);
  },
  async unfavourite(req, res) {
    const result = await recipeService.toggleLike(
      req.user.userId,
      req.params.id,
    );
    return res.ok(result);
  },
  async bookmark(req, res) {
    const result = await recipeService.toggleBookmark(
      req.user.userId,
      req.params.id,
    );
    return res.ok(result);
  },
  async unbookmark(req, res) {
    const result = await recipeService.toggleBookmark(
      req.user.userId,
      req.params.id,
    );
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

    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    const result = await recipeService.update(req.params.id, data);
    return res.ok(result);
  },
  async createComment(req, res) {
    const { content, parentId } = req.body;
    if (!content) return res.badRequest("Comment content is required");
    const result = await recipeService.createComment(
      req.user.userId,
      req.params.id,
      content,
      parentId,
    );
    return res.ok(result);
  },
  async getComments(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const result = await recipeService.getComments(req.params.id, page, limit);
    return res.ok(result);
  },
  async deleteComment(req, res) {
    try {
      await recipeService.deleteComment(req.params.commentId, req.user.userId);
      return res.ok({ message: "Comment deleted successfully" });
    } catch (error) {
      if (error.message === "Unauthorized")
        return res.forbidden("You can only delete your own comments");
      return res.badRequest(error.message);
    }
  },
  async updateComment(req, res) {
    const { content } = req.body;
    if (!content) return res.badRequest("Comment content is required");
    try {
      const result = await recipeService.updateComment(
        req.params.commentId,
        req.user.userId,
        content,
      );
      return res.ok(result);
    } catch (error) {
      if (error.message === "Unauthorized")
        return res.forbidden("You can only update your own comments");
      return res.badRequest(error.message);
    }
  },
};
