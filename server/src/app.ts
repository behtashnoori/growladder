import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import { spec } from "./docs/openapi.js";

const app = express();

// CORS: allow any localhost/127.0.0.1 port in dev, plus optional FRONTEND_ORIGIN
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin
    if (!origin) return callback(null, true);

    const allowedDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
    const explicit = process.env.FRONTEND_ORIGIN;

    if (allowedDev.test(origin) || (explicit && origin === explicit)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  optionsSuccessStatus: 200,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, _res, next) => {
  console.log(`[api] ${req.method} ${req.path}`);
  next();
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use(router);

app.use(errorHandler);

export default app;
