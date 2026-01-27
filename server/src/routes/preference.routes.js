import { Router } from "express";
import {
  getPreferences,
  updatePreferences,
} from "../controllers/preference.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getPreferences);
router.put("/", authMiddleware, updatePreferences);

export default router;
