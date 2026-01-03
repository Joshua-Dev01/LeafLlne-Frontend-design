import { apiPost } from "../../../../services/apiCall";
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../../interface/Auth.interface";

// ✅ Fixed Reset password API
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  return await apiPost<ResetPasswordResponse, { password: string }>(
    `/auth/reset-password/${data.token}`,
    { password: data.password }
  );
};
