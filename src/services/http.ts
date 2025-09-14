import axios from "axios";
import { toast } from "@/components/ui/sonner";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? "خطا در ارتباط با سرور";
    toast.error(message);
    return Promise.reject(err);
  }
);

export default http;
