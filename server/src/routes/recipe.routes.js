import { Router } from "express";
const router = Router();
import {
    recipeCreateSchema,
} from "../schemas/recipe.schema.js";
import { recipeController } from "../controllers/recipe.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
router.get(
    "/",
    apiKeyAuth,
    recipeController.getRecipes
)
router.post(
    "/create",
    apiKeyAuth,
    validate({ body: recipeCreateSchema }),
    recipeController.create
)
export default router