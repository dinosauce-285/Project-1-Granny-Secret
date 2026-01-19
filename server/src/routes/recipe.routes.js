import { Router } from "express";
const router = Router();
import { recipeController } from "../controllers/recipe.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

router.get("/", apiKeyAuth, authMiddleware, recipeController.getRecipes);
router.get("/my-recipes", authMiddleware, recipeController.getMyRecipes);
router.get("/:id", apiKeyAuth, authMiddleware, recipeController.getRecipeById);
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  recipeController.create,
);
router.patch("/:id/favourite", authMiddleware, recipeController.favourite);
router.patch("/:id/unfavourite", authMiddleware, recipeController.unfavourite);
router.patch("/:id/bookmark", authMiddleware, recipeController.bookmark);
router.patch("/:id/unbookmark", authMiddleware, recipeController.unbookmark);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  recipeController.update,
);
router.delete("/:id", authMiddleware, recipeController.delete);
router.post("/:id/comments", authMiddleware, recipeController.createComment);
router.get("/:id/comments", apiKeyAuth, recipeController.getComments);
router.delete(
  "/comments/:commentId",
  authMiddleware,
  recipeController.deleteComment,
);
router.put(
  "/comments/:commentId",
  authMiddleware,
  recipeController.updateComment,
);
export default router;
