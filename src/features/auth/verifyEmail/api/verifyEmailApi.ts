import { apiPost } from "../../../../services/apiCall";
import type {
  ResendVerifyEmailData,
  ResendVerifyEmailResponse,
  VerifyEmailData,
  VerifyEmailResponse,
} from "../interface/verifyEmail";

export const verifyEmail = async (
  data: VerifyEmailData
): Promise<VerifyEmailResponse> => {
  return await apiPost<VerifyEmailResponse, VerifyEmailData>(
    "/auth/verify-email",
    data
  );
};

export const resendVerifyEmail = async (email: string) => {
  const response = {
    data: await apiPost<ResendVerifyEmailResponse, ResendVerifyEmailData>(
      "/auth/resend-email",
      { email }
    ),
  };

  return response.data;
};
