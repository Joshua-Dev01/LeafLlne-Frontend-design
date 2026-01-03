import { apiPost } from "../../../../services/apiCall";
import type {
  RegisterData,
  RegisterResponse,
} from "../../interface/Auth.interface";

export const registerUser = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  return await apiPost<RegisterResponse, RegisterData>("/auth/signup", data);
};
