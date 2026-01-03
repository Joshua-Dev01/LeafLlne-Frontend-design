export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  token?: string; // optional token
  user?: {
    // optional user object
    id: string;
    name: string;
    email: string;
    isVerified?: boolean;
  };
}

export interface ResendVerifyEmailData {
  email: string;
}

export interface ResendVerifyEmailResponse {
  message: string;
  emailSent: boolean;
}
