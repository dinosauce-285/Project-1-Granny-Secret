import { prisma } from "../prisma.js";

export const recipeService = {
  async getRecipes(filters = {}, currentUserId = null) {
    const where = {};

    if (filters.categoryId) {
      where.categoryId = Number(filters.categoryId);
    }

    if (
      (filters.favourite === true || filters.favourite === "true") &&
      currentUserId
    ) {
      where.likes = {
        some: {
          userId: Number(currentUserId),
        },
      };
    }

    if ((filters.saved === true || filters.saved === "true") && currentUserId) {
      where.bookmarks = {
        some: {
          userId: Number(currentUserId),
        },
      };
    }
    if (filters.userId) {
      where.userId = Number(filters.userId);
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        {
          ingredients: {
            some: {
              name: { contains: filters.search, mode: "insensitive" },
            },
          },
        },
        {
          steps: {
            some: {
              content: { contains: filters.search, mode: "insensitive" },
            },
          },
        },
        { note: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const include = {
      category: true,
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          likes: true,
          bookmarks: true,
        },
      },
    };

    if (currentUserId) {
      include.likes = {
        where: {
          userId: Number(currentUserId),
        },
        take: 1,
      };
      include.bookmarks = {
        where: {
          userId: Number(currentUserId),
        },
        take: 1,
      };
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include,
      orderBy: {
        createdAt: "desc",
      },
    });

    return recipes.map((recipe) => {
      const isLiked = currentUserId && recipe.likes && recipe.likes.length > 0;
      const isSaved =
        currentUserId && recipe.bookmarks && recipe.bookmarks.length > 0;
      const { likes, bookmarks, ...rest } = recipe;
      return {
        ...rest,
        isLiked: !!isLiked,
        isSaved: !!isSaved,
        likeCount: recipe._count.likes,
        bookmarkCount: recipe._count.bookmarks,
      };
    });
  },
  async getRecipeById(id, currentUserId = null) {
    const include = {
      ingredients: true,
      steps: true,
      category: true,
      user: true,
      _count: {
        select: {
          likes: true,
          bookmarks: true,
        },
      },
    };

    if (currentUserId) {
      include.likes = {
        where: { userId: Number(currentUserId) },
        take: 1,
      };
      include.bookmarks = {
        where: { userId: Number(currentUserId) },
        take: 1,
      };
    }

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: id,
      },
      include,
    });

    if (!recipe) return null;

    const isLiked = currentUserId && recipe.likes && recipe.likes.length > 0;
    const isSaved =
      currentUserId && recipe.bookmarks && recipe.bookmarks.length > 0;
    const { likes, bookmarks, ...rest } = recipe;

    return {
      ...rest,
      isLiked: !!isLiked,
      isSaved: !!isSaved,
      likeCount: recipe._count.likes,
      bookmarkCount: recipe._count.bookmarks,
    };
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
  async toggleLike(userId, recipeId) {
    const existing = await prisma.like.findUnique({
      where: {
        userId_recipeId: {
          userId: Number(userId),
          recipeId: Number(recipeId),
        },
      },
    });

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id },
      });
      const count = await prisma.like.count({
        where: { recipeId: Number(recipeId) },
      });
      return { isLiked: false, likeCount: count };
    } else {
      await prisma.like.create({
        data: {
          userId: Number(userId),
          recipeId: Number(recipeId),
        },
      });
      const count = await prisma.like.count({
        where: { recipeId: Number(recipeId) },
      });
      return { isLiked: true, likeCount: count };
    }
  },
  async toggleBookmark(userId, recipeId) {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_recipeId: {
          userId: Number(userId),
          recipeId: Number(recipeId),
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      const count = await prisma.bookmark.count({
        where: { recipeId: Number(recipeId) },
      });
      return { isSaved: false, bookmarkCount: count };
    } else {
      await prisma.bookmark.create({
        data: {
          userId: Number(userId),
          recipeId: Number(recipeId),
        },
      });
      const count = await prisma.bookmark.count({
        where: { recipeId: Number(recipeId) },
      });
      return { isSaved: true, bookmarkCount: count };
    }
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

    if (data.imageUrl) {
      updatePayload.imageUrl = data.imageUrl;
    }

    if (data.ingredients && Array.isArray(data.ingredients)) {
      updatePayload.ingredients = {
        create: data.ingredients.map((ing) => ({
          name: ing.name,
          amount: ing.amount ?? null,
          unit: ing.unit ?? null,
        })),
      };
    }

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
  async createComment(userId, recipeId, content, parentId = null) {
    return await prisma.comment.create({
      data: {
        userId: Number(userId),
        recipeId: Number(recipeId),
        content,
        parentId: parentId ? Number(parentId) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  },
  async getComments(recipeId) {
    return await prisma.comment.findMany({
      where: {
        recipeId: Number(recipeId),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  async deleteComment(commentId, userId) {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== Number(userId)) {
      throw new Error("Unauthorized");
    }
    return await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
  },
  async updateComment(commentId, userId, content) {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== Number(userId)) {
      throw new Error("Unauthorized");
    }
    return await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { content },
    });
  },
};
