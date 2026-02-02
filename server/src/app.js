import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { responseWrapper } from "./middlewares/response.middleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";

import categoryRoutes from "./routes/category.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import searchRoutes from "./routes/search.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import preferenceRoutes from "./routes/preference.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://granny-secret.onrender.com"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseWrapper);
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/ai", aiRoutes);

const clientBuildPath = path.join(__dirname, "../../client/build");
app.use(express.static(clientBuildPath));

app.get(/(.*)/, (req, res, next) => {
  if (req.url.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);
