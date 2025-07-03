import axiosInstance from "./apis";

export const apiGet = async <T>(url: string): Promise<T> => {
  const res = await axiosInstance.get<T>(url);
  return res.data;
};

export const apiPost = async <T, D>(url: string, data: D): Promise<T> => {
  const res = await axiosInstance.post<T>(url, data);
  return res.data;
};

export const apiPut = async <T, D>(url: string, data: D): Promise<T> => {
  const res = await axiosInstance.put<T>(url, data);
  return res.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const res = await axiosInstance.delete<T>(url);
  return res.data;
};
