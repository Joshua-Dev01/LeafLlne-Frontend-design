import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const api = axios.create({
  // You can add your baseURL or other config here
  // baseURL: "https://your-api-url.com",
});

api.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

api.interceptors.response.use(
  (res) => {
    NProgress.done();
    return res;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default api;
