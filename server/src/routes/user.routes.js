import { Router } from "express";
import { userController } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/me", authMiddleware, userController.getMe);
router.put("/me", authMiddleware, upload.single("image"), userController.updateProfile);
router.get("/me/following", authMiddleware, userController.getFollowedUsers);
router.get("/:id/recipes", userController.getUserRecipes);
router.get("/:id", userController.getUserProfile);
router.get("/:id/is-following", authMiddleware, userController.checkIsFollowing);
router.post("/:id/follow", authMiddleware, userController.toggleFollow);

export default router;