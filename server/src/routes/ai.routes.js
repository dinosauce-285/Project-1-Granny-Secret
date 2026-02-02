import express from "express";
import * as aiController from "../controllers/ai.controllers.js";

const router = express.Router();

router.post("/chat", aiController.chat);

export default router;
