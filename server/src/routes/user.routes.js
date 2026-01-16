import { Router } from "express";
import { userController } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, userController.getMe);
router.get("/:id/recipes", userController.getUserRecipes);
router.get("/:id", userController.getUserProfile);

export default router;
