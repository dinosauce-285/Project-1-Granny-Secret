import { Router } from "express";
const router = Router();
import { searchController } from "../controllers/search.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

router.get("/", apiKeyAuth, authMiddleware, searchController.globalSearch);

export default router;
