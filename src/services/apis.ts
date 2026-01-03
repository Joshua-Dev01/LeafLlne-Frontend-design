import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import NProgress from "nprogress";

// Use environment variable for base URL
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false, // allows sending cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

//  Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    NProgress.start();
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error: AxiosError) => {
    NProgress.done();
    const status = error.response?.status;

    // Extract backend custom message
    const errorMessage =
      (error.response?.data as { message?: string })?.message || "";

    // ✅ Only force logout if token is truly invalid or expired
    const authErrors = [
      "Invalid token",
      "Token expired",
      "Authentication failed",
      "User not authorized",
    ];

    if (status === 401 && authErrors.includes(errorMessage)) {
      localStorage.removeItem("token");
      localStorage.removeItem("isVerified");
      window.location.href = "/auth/login";
      return;
    }

    return Promise.reject(error); // ✅ allow frontend to handle DP upload errors
  }
);
