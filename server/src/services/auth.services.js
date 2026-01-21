import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailService } from "./email.services.js";
import { supabase } from "../config/supabase.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

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

    emailService.sendWelcomeEmail(email, username);

    return user;
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      token,
    };
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

  async loginWithGoogle(token) {
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      console.error("Supabase getUser error:", {
        error: error,
        errorMessage: error?.message,
        errorStatus: error?.status,
        hasUser: !!supabaseUser,
        tokenProvided: !!token,
      });
      throw new Error(
        error?.message || "Invalid Google token - unable to verify user",
      );
    }

    const { email, user_metadata } = supabaseUser;
    const { full_name, avatar_url, name } = user_metadata || {};

    const provider = user_metadata?.provider || "google";
    const providerId = supabaseUser.id;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: providerId },
          { facebookId: providerId },
          { email: email },
        ],
      },
    });

    if (user) {
      const needsUpdate =
        (provider === "google" && !user.googleId) ||
        (provider === "facebook" && !user.facebookId);

      if (needsUpdate) {
        user = await prisma.user.update({
          where: { id: user.id },
          data:
            provider === "google"
              ? { googleId: providerId }
              : { facebookId: providerId },
        });
      }
    } else {
      let username =
        name?.replace(/\s+/g, "").toLowerCase() || email.split("@")[0];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      username = `${username}${randomSuffix}`;

      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUsername) {
        username = `${username}${Math.floor(Date.now() / 1000)}`;
      }

      user = await prisma.user.create({
        data: {
          email,
          username,
          googleId: provider === "google" ? providerId : null,
          facebookId: provider === "facebook" ? providerId : null,
          fullName: full_name || name,
          avatarUrl: avatar_url,
          role: "USER",
        },
      });

      emailService.sendWelcomeEmail(email, username);
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const appToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      token: appToken,
    };
  },
};
