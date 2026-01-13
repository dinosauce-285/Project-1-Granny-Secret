import { prisma } from "../prisma.js";

export const recipeService = {
  async getRecipes(filters = {}) {
    const where = {};

    if (filters.categoryId) {
      where.categoryId = Number(filters.categoryId);
    }
    if (filters.favourite === true || filters.favourite === "true") {
      where.favourite = true;
    }
    if (filters.userId) {
      where.userId = Number(filters.userId);
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return recipes;
  },
  async getRecipeById(id) {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: id,
      },
      include: {
        ingredients: true,
        steps: true,
        category: true,
        user: true,
      },
    });
    return recipe;
  },
  async create(data) {
    if (
      !data.ingredients ||
      !Array.isArray(data.ingredients) ||
      data.ingredients.length === 0
    ) {
      throw new Error("At least one ingredient is required");
    }

    const createPayload = {
      title: data.title,
      imageUrl: data.imageUrl,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      spiciness: typeof data.spiciness === "number" ? data.spiciness : 0,
      difficulty: data.difficulty,
      note: data.note,
      favourite: typeof data.favourite === "boolean" ? data.favourite : false,
      categoryId: data.categoryId,
      userId: data.userId,
      ingredients: {
        create: data.ingredients.map((ing) => ({
          name: ing.name,
          amount: ing.amount ?? null,
          unit: ing.unit ?? null,
        })),
      },
    };

    if (data.steps && Array.isArray(data.steps) && data.steps.length > 0) {
      createPayload.steps = {
        create: data.steps.map((s) => ({
          stepOrder: s.stepOrder,
          content: s.content,
        })),
      };
    }

    const recipe = await prisma.recipe.create({
      data: createPayload,
      include: {
        ingredients: true,
        steps: true,
        category: true,
        user: true,
      },
    });

    return recipe;
  },
  async toggleFavourite(id, value) {
    return await prisma.recipe.update({
      where: { id: Number(id) },
      data: { favourite: value },
    });
  },
  async delete(id) {
    await prisma.ingredient.deleteMany({ where: { recipeId: Number(id) } });
    await prisma.step.deleteMany({ where: { recipeId: Number(id) } });
    return await prisma.recipe.delete({
      where: { id: Number(id) },
    });
  },
  async update(id, data) {
    // Delete existing ingredients and steps
    await prisma.ingredient.deleteMany({ where: { recipeId: Number(id) } });
    await prisma.step.deleteMany({ where: { recipeId: Number(id) } });

    const updatePayload = {
      title: data.title,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      spiciness: typeof data.spiciness === "number" ? data.spiciness : 0,
      difficulty: data.difficulty,
      note: data.note,
      categoryId: data.categoryId,
    };

    // Only update imageUrl if provided
    if (data.imageUrl) {
      updatePayload.imageUrl = data.imageUrl;
    }

    // Create new ingredients
    if (data.ingredients && Array.isArray(data.ingredients)) {
      updatePayload.ingredients = {
        create: data.ingredients.map((ing) => ({
          name: ing.name,
          amount: ing.amount ?? null,
          unit: ing.unit ?? null,
        })),
      };
    }

    // Create new steps
    if (data.steps && Array.isArray(data.steps) && data.steps.length > 0) {
      updatePayload.steps = {
        create: data.steps.map((s) => ({
          stepOrder: s.stepOrder,
          content: s.content,
        })),
      };
    }

    const recipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: updatePayload,
      include: {
        ingredients: true,
        steps: true,
        category: true,
        user: true,
      },
    });

    return recipe;
  },
};
