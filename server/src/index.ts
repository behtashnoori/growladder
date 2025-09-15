import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import app from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[api] server listening on http://127.0.0.1:${PORT}`);
});
