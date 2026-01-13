import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";

export const authService = {
  async register({ email, username, password, fullName }) {
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        fullName: fullName || null,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  },

  async updateProfile(userId, { fullName, avatarUrl }) {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        fullName: fullName || null,
        avatarUrl: avatarUrl || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        role: true,
      },
    });
    return user;
  },
};
