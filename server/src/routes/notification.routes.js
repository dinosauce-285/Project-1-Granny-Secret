import express from "express";
import { notificationController } from "../controllers/notification.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", notificationController.getNotifications);
router.put("/:id/read", notificationController.readNotification);
router.put("/read-all", notificationController.readAllNotifications);

export default router;
