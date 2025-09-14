import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import { spec } from "./docs/openapi.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use(router);

app.use(errorHandler);

export default app;
