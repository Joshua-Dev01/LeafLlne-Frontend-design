import { apiPost } from "../../../../services/apiCall";
import type { LoginData, LoginResponse } from "../../interface/Auth.interface";

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  return await apiPost<LoginResponse, LoginData>("/auth/login", data);
};
