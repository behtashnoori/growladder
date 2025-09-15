import axios from "axios";
import { toast } from "sonner";

// Requests are proxied to the backend by Vite during development
const http = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

// Global response / error handling with a Persian-friendly toast
let lastMsg = "";
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "خطا در ارتباط با سرور";
    if (msg !== lastMsg) {
      lastMsg = msg;
      setTimeout(() => (lastMsg = ""), 1500);
      try {
        toast.error(`${msg}${status ? ` (HTTP ${status})` : ""}`);
      } catch {
        // ignore toast errors
      }
    }
    return Promise.reject(err);
  }
);

export default http;
