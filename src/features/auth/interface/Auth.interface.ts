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
  };
}

//forgot password type
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}
