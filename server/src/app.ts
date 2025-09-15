import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import { spec } from "./docs/openapi.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[api] ${req.method} ${req.path}`);
  next();
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use(router);

app.use(errorHandler);

export default app;
