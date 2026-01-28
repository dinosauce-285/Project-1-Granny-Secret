import { notificationService } from "../services/notification.services.js";

export const notificationController = {
  async getNotifications(req, res, next) {
    try {
      const userId = req.user.userId;
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      console.log("Backend: getNotifications for user", userId);
      const notifications = await notificationService.getUserNotifications(
        userId,
        page,
        limit,
      );
      console.log("Backend: Found notifications:", notifications.length);
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error("Backend: Error getting notifications", error);
      next(error);
    }
  },

  async readNotification(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      await notificationService.markAsRead(id, userId);
      res.status(200).json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (error) {
      next(error);
    }
  },

  async readAllNotifications(req, res, next) {
    try {
      const userId = req.user.userId;
      await notificationService.markAllAsRead(userId);
      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      next(error);
    }
  },
};
