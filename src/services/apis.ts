import axios from "axios";
import NProgress from "nprogress";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance  = axios.create({
  baseURL,
  withCredentials: false,
});

axiosInstance .interceptors.request.use((config) => {
  NProgress.start();
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance .interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default axiosInstance ;
