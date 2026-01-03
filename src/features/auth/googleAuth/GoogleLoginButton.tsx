import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

import { handleResponse } from "../../../utils/handleErrors";
import { loginWithGoogle } from "./api/googleApi";
import type { GoogleLoginResponse, GoogleLoginData } from "./api/googleApi";


declare module "@react-oauth/google" {
  interface TokenResponse {
    id_token?: string;
  }
}


const GoogleAuthButton = () => {
  const navigate = useNavigate();

  const { mutate } = useMutation<GoogleLoginResponse, unknown, GoogleLoginData>(
    {
      mutationFn: loginWithGoogle,
      onSuccess: (data) => {
        handleResponse({
          successCondition: true,
          successMsg: "Login successful!",
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("leafline_user", JSON.stringify(data.user));

        navigate("/dashboard");
      },
      onError: (error) => handleResponse({ error }),
    }
  );

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: (tokenResponse: TokenResponse) => {
      if (!tokenResponse.id_token) {
        return handleResponse({ error: new Error("Google ID token missing") });
      }

      mutate({ token: tokenResponse.id_token }); //  Correct token
    },
    onError: () => handleResponse({ error: new Error("Google login failed") }),
  });

  return (
    <button
      onClick={() => handleGoogleLogin()}
      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium bg-[#3d414d9c] hover:bg-[#3d414dff] cursor-pointer transition-all duration-200"
    >
      <FcGoogle className="text-[18px]" />
      <span className="text-gray-100 font-semibold tracking-wide">
        Continue with Google
      </span>
    </button>
  );
};

export default GoogleAuthButton;
