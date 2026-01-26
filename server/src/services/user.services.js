import { prisma } from "../prisma.js";

export const userService = {
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  },

  async updateProfile(userId, { fullName, avatarUrl }) {
    const data = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;

    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
      },
    });
    return user;
  },

  async getUserProfile(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return null;
    }

    const recipesCount = await prisma.recipe.count({
      where: { userId: Number(userId) },
    });

    const followersCount = await prisma.follow.count({
      where: { followingId: Number(userId) },
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: Number(userId) },
    });

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      stats: {
        recipesCount,
        followersCount,
        followingCount,
      },
    };
  },

  async getUserRecipes(userId, currentUserId = null) {
    const include = {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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
      where: {
        userId: Number(userId),
      },
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

  async checkIsFollowing(followerId, followingId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });
    return !!follow;
  },

  async toggleFollow(followerId, followingId) {
    if (Number(followerId) === Number(followingId)) {
      throw new Error("You cannot follow yourself");
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: Number(followerId),
            followingId: Number(followingId),
          },
        },
      });
      return { isFollowing: false };
    } else {
      await prisma.follow.create({
        data: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      });

      await prisma.notification.create({
        data: {
          recipientId: Number(followingId),
          senderId: Number(followerId),
          type: "FOLLOW",
        },
      });

      return { isFollowing: true };
    }
  },

  async getFollowedUsers(userId) {
    const follows = await prisma.follow.findMany({
      where: {
        followerId: Number(userId),
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return follows.map((follow) => follow.following);
  },
};
