import { Router } from "express";
import { authController } from "../controllers/auth.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/register", apiKeyAuth, authController.register);
router.post("/login", apiKeyAuth, authController.login);
router.put(
  "/profile",
  apiKeyAuth,
  upload.single("avatar"),
  authController.updateProfile,
);
router.post("/google-login", apiKeyAuth, authController.googleLogin);
router.post(
  "/forgot-password",
  apiKeyAuth,
  authController.requestPasswordReset,
);
router.post("/reset-password/:token", apiKeyAuth, authController.resetPassword);

export default router;
