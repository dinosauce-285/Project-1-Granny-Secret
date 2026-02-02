import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";

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

  async updateProfile(userId, { fullName, username, avatarUrl }) {
    const data = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (username !== undefined) data.username = username;
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

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error(
        "This account is managed via social login (Google/Facebook). You cannot set a password here.",
      );
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Incorrect current password");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashedPassword },
    });

    return { message: "Password updated successfully" };
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

  async getUserRecipes(userId, currentUserId = null, page = 1, limit = 10) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

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
      skip,
      take,
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

  async getFollowedUsers(userId, page = 1, limit = 10) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

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
      skip,
      take,
    });

    return follows.map((follow) => ({
      ...follow.following,
      isFollowing: true,
    }));
  },

  async deleteAccount(userId, password) {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error(
        "This account is managed via social login. Please contact support to delete your account.",
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }

    await prisma.comment.updateMany({
      where: { userId: Number(userId) },
      data: { userId: null },
    });

    await prisma.recipe.updateMany({
      where: { userId: Number(userId) },
      data: { userId: null },
    });

    await prisma.like.deleteMany({
      where: { userId: Number(userId) },
    });

    await prisma.bookmark.deleteMany({
      where: { userId: Number(userId) },
    });

    await prisma.follow.deleteMany({
      where: { followerId: Number(userId) },
    });

    await prisma.follow.deleteMany({
      where: { followingId: Number(userId) },
    });
    await prisma.notification.deleteMany({
      where: { senderId: Number(userId) },
    });
    await prisma.notification.deleteMany({
      where: { recipientId: Number(userId) },
    });

    await prisma.preference.deleteMany({
      where: { userId: Number(userId) },
    });
    await prisma.user.delete({
      where: { id: Number(userId) },
    });

    return { message: "Account deleted successfully" };
  },
};
