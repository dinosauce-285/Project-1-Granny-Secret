import { userService } from "../services/user.services.js";
import cloudinary from "../config/cloudinary.config.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const userController = {
  async getMe(req, res) {
    const userId = req.user.userId;
    const isUser = await userService.getUserById(userId);
    return res.ok(isUser);
  },

  async updateProfile(req, res) {
    const userId = req.user.userId;
    let avatarUrl;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await userService.updateProfile(userId, {
      fullName: req.body.fullName,
      username: req.body.username,
      avatarUrl,
    });

    return res.ok(updatedUser);
  },

  async changePassword(req, res) {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.error("Current and new password are required");
    }

    try {
      const result = await userService.changePassword(userId, {
        currentPassword,
        newPassword,
      });
      return res.ok(result);
    } catch (error) {
      return res.error(error.message);
    }
  },

  async getUserProfile(req, res) {
    const { id } = req.params;
    const userProfile = await userService.getUserProfile(id);

    if (!userProfile) {
      return res.notFound("User not found");
    }

    return res.ok(userProfile);
  },

  async getUserRecipes(req, res) {
    const { id } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let currentUserId = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        currentUserId = decoded.userId;
      } catch (error) {
        console.log("Auth failed:", error.message);
      }
    }

    const recipes = await userService.getUserRecipes(
      id,
      currentUserId,
      page,
      limit,
    );
    return res.ok(recipes);
  },

  async checkIsFollowing(req, res) {
    const followerId = req.user.userId;
    const followingId = req.params.id;

    const isFollowing = await userService.checkIsFollowing(
      followerId,
      followingId,
    );
    return res.ok({ isFollowing });
  },

  async toggleFollow(req, res) {
    const followerId = req.user.userId;
    const followingId = req.params.id;

    const result = await userService.toggleFollow(followerId, followingId);
    return res.ok(result);
  },

  async getFollowedUsers(req, res) {
    const userId = req.user.userId;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const followedUsers = await userService.getFollowedUsers(
      userId,
      page,
      limit,
    );
    return res.ok(followedUsers);
  },

  async deleteAccount(req, res) {
    const userId = req.user.userId;
    const { password } = req.body;

    if (!password) {
      return res.error("Password is required to delete account");
    }

    try {
      await userService.deleteAccount(userId, password);
      return res.ok({ message: "Account deleted successfully" });
    } catch (error) {
      return res.error(error.message);
    }
  },
};
