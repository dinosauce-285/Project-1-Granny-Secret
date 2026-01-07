import dotenv from "dotenv";
dotenv.config();

import { app } from "./src/app.js";
app.listen(process.env.PORT, () =>
  console.log(`Secure API running on port ${process.env.PORT}`)
);
