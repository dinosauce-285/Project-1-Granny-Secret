import { Router } from "express";
const router = Router();    
import { categoryController } from "../controllers/category.controllers.js";
import { apiKeyAuth } from "../middlewares/apikey.middleware.js";
router.get(
    "/",
    apiKeyAuth,
    categoryController.getCategories
)
export default router