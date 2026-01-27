import { prisma } from "../prisma.js";

export const preferenceService = {
  async getOrCreateUserPreferences(userId) {
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: Number(userId) },
    });

    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId: Number(userId),
          notifyOnLike: true,
          notifyOnFollow: true,
          notifyOnComment: true,
        },
      });
    }

    return preferences;
  },

  async updateUserPreferences(userId, data) {
    const preferences = await this.getOrCreateUserPreferences(userId);

    return await prisma.userPreferences.update({
      where: { id: preferences.id },
      data: {
        notifyOnLike: data.notifyOnLike ?? preferences.notifyOnLike,
        notifyOnFollow: data.notifyOnFollow ?? preferences.notifyOnFollow,
        notifyOnComment: data.notifyOnComment ?? preferences.notifyOnComment,
      },
    });
  },
};
