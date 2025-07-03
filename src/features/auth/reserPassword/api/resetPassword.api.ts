import { apiPost } from "../../../../services/apiCall";
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../../interface/Auth.interface";

// Reset password API
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  return await apiPost<ResetPasswordResponse, ResetPasswordRequest>(
    `/auth/reset-password/${data.token}`,
    { token: data.token, password: data.password }
  );
};
