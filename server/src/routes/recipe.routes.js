import { Router } from "express";
const router = Router();
import { recipeController } from "../controllers/recipe.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

router.get("/", apiKeyAuth, recipeController.getRecipes);
router.get("/:id", apiKeyAuth, recipeController.getRecipeById);
router.post(
  "/create",
  apiKeyAuth,
  upload.single("image"),
  recipeController.create
);
router.patch("/:id/favourite", apiKeyAuth, recipeController.favourite);
router.patch("/:id/unfavourite", apiKeyAuth, recipeController.unfavourite);
export default router;