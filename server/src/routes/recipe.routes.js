import { Router } from "express";
const router = Router();    
import { recipeController } from "../controllers/recipe.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";
router.get(
    "/",
    apiKeyAuth,
    recipeController.getRecipes
)
export default router