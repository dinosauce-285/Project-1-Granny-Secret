import { Router } from "express";
const router = Router();
import { recipeController } from "../controllers/recipe.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

router.get("/", apiKeyAuth, recipeController.getRecipes);
router.post(
  "/create",
  apiKeyAuth,
  upload.single("image"),
  recipeController.create
);
export default router;
