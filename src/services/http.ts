import axios from "axios";
import { toast } from "sonner";

// Requests are proxied to the backend by Vite during development
const http = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: false,
});

// Optional: attach auth token if you store it in localStorage/sessionStorage
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response / error handling with a Persian-friendly toast
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.";
    // show toast only once per error
    try {
      toast.error(`${msg}${status ? ` (HTTP ${status})` : ""}`);
    } catch (e) {
      // noop
    }
    return Promise.reject(err);
  }
);

export default http;
