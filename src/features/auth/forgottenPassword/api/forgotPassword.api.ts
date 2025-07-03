import { apiPost } from "../../../../services/apiCall";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../../interface/Auth.interface";

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  return await apiPost<ForgotPasswordResponse, ForgotPasswordRequest>(
    "/auth/forgot-password",
    data
  );
};
