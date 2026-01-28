import { prisma } from "../prisma.js";

export const searchService = {
  async globalSearch(query, currentUserId = null) {
    if (!query || query.trim() === "") {
      return {
        recipes: [],
        users: [],
        categories: [],
        ingredients: [],
        total: 0,
      };
    }

    const searchTerm = query.trim();

    const recipeWhere = {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        {
          ingredients: {
            some: {
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
        },
        {
          steps: {
            some: {
              content: { contains: searchTerm, mode: "insensitive" },
            },
          },
        },
        { note: { contains: searchTerm, mode: "insensitive" } },
      ],
    };

    const recipeInclude = {
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
      recipeInclude.likes = {
        where: {
          userId: Number(currentUserId),
        },
        take: 1,
      };
      recipeInclude.bookmarks = {
        where: {
          userId: Number(currentUserId),
        },
        take: 1,
      };
    }

    const recipes = await prisma.recipe.findMany({
      where: recipeWhere,
      include: recipeInclude,
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: searchTerm, mode: "insensitive" } },
          { fullName: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        _count: {
          select: {
            recipes: true,
            followers: true,
          },
        },
      },
      take: 10,
    });

    let followedUserIds = new Set();
    if (currentUserId) {
      const recipeAuthorIds = recipes.map((r) => r.userId);
      const foundUserIds = users.map((u) => u.id);
      const allTargetIds = [...new Set([...recipeAuthorIds, ...foundUserIds])];

      if (allTargetIds.length > 0) {
        const follows = await prisma.follow.findMany({
          where: {
            followerId: Number(currentUserId),
            followingId: { in: allTargetIds },
          },
        });
        followedUserIds = new Set(follows.map((f) => f.followingId));
      }
    }

    const formattedRecipes = recipes.map((recipe) => {
      const isLiked = currentUserId && recipe.likes && recipe.likes.length > 0;
      const isSaved =
        currentUserId && recipe.bookmarks && recipe.bookmarks.length > 0;
      const { likes, bookmarks, ...rest } = recipe;
      return {
        ...rest,
        isLiked: !!isLiked,
        isSaved: !!isSaved,
        isFollowing: followedUserIds.has(recipe.userId),
        likeCount: recipe._count.likes,
        bookmarkCount: recipe._count.bookmarks,
      };
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      isFollowing: followedUserIds.has(user.id),
      recipesCount: user._count.recipes,
      followersCount: user._count.followers,
    }));

    const total = formattedRecipes.length + formattedUsers.length;

    return {
      recipes: formattedRecipes,
      users: formattedUsers,
      total,
    };
  },
};
