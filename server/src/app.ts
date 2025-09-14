import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use(router);

app.use(errorHandler);

export default app;
