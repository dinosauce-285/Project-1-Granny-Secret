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

  async getUserRecipes(userId) {
    const recipes = await prisma.recipe.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return recipes;
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
