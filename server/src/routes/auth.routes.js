import { Router } from "express";
import { authController } from "../controllers/auth.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";

const router = Router();

router.post("/register", apiKeyAuth, authController.register);
router.post("/login", apiKeyAuth, authController.login);
router.put("/profile", apiKeyAuth, authController.updateProfile);

export default router;
