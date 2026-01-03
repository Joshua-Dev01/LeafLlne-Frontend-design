// src/features/auth/services/googleAuth.service.ts

import { apiPost } from "../../../../services/apiCall";


export interface GoogleLoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        message: string;
        email: string;
        role: string;
        bio?: string;
        accountType?: string;
    };
}

export interface GoogleLoginData {
    token: string; // Google ID token from frontend
}

/**
 * Sign in or register user via Google OAuth
 */
export const loginWithGoogle = async (
    data: GoogleLoginData
): Promise<GoogleLoginResponse> => {
    return await apiPost<GoogleLoginResponse, GoogleLoginData>(
        "/auth/googleAuth",
        data
    );
};
