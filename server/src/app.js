import express from 'express';
import cors from 'cors';
import morgan from 'morgan';    
import { responseWrapper } from "./middlewares/response.middleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import categoryRoutes from "./routes/category.routes.js"
export const app = express();
app.use(cors());
app.use(express.json());    
app.use(responseWrapper);
app.use(morgan("dev")); 
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Welcome to the API"));
app.use("/categories", categoryRoutes);  
app.use(notFoundHandler)
app.use(errorHandler)


