import { Router } from "express";
import { userController } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, userController.getMe);

export default router;
