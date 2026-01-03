//  signup type
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

//Login type
export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    isVerified: boolean;
  };
}

//forgot password type
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string; // Optional depending on backend flow
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface GoogleLoginResponse {
  credential: string; // the JWT token returned by Google
  clientId: string;
  message: string;

  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
}
