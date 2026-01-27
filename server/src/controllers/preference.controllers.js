import { preferenceService } from "../services/preference.services.js";

export const getPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const preferences =
      await preferenceService.getOrCreateUserPreferences(userId);
    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error getting preferences:", error);
    res.status(500).json({ message: "Failed to get preferences" });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notifyOnLike, notifyOnFollow, notifyOnComment } = req.body;

    const preferences = await preferenceService.updateUserPreferences(userId, {
      notifyOnLike,
      notifyOnFollow,
      notifyOnComment,
    });

    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ message: "Failed to update preferences" });
  }
};
