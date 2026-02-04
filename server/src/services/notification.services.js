import { prisma } from "../prisma.js";
import { sseManager } from "../utils/sse.utils.js";

export const notificationService = {
  async createNotification({ recipientId, senderId, type, recipeId }) {
    if (Number(recipientId) === Number(senderId)) {
      return null;
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: Number(recipientId) },
    });

    if (preferences) {
      if (type === "LIKE" && !preferences.notifyOnLike) return null;
      if (type === "FOLLOW" && !preferences.notifyOnFollow) return null;
      if (type === "COMMENT" && !preferences.notifyOnComment) return null;
    }

    const notification = await prisma.notification.create({
      data: {
        recipientId: Number(recipientId),
        senderId: Number(senderId),
        type,
        recipeId: recipeId ? Number(recipeId) : null,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
      },
    });

    sseManager.sendToUser(recipientId, notification);
    return notification;
  },

  async getUserNotifications(userId, page = 1, limit = 10) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    return await prisma.notification.findMany({
      where: {
        recipientId: Number(userId),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });
  },

  async markAsRead(notificationId, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id: Number(notificationId) },
    });

    if (!notification || notification.recipientId !== Number(userId)) {
      throw new Error("Notification not found or unauthorized");
    }

    return await prisma.notification.update({
      where: { id: Number(notificationId) },
      data: { read: true },
    });
  },

  async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: {
        recipientId: Number(userId),
        read: false,
      },
      data: { read: true },
    });
  },
};
