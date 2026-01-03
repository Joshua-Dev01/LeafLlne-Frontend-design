import { useState, useRef, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { handleResponse } from "../../../../utils/handleErrors";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LoaderCircleIcon } from "lucide-react";
import { verifyEmail } from "../api/verifyEmailApi";
import type {
  VerifyEmailData,
  VerifyEmailResponse,
} from "../interface/verifyEmail";
import ResendCode from "./ResendCode";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("verifyEmail") || "";
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [seconds, setSeconds] = useState(50);

  useEffect(() => {
    if (!email) {
      handleResponse({ error: "No email found. Please sign up again 🚫" });
      navigate("/auth/signup");
      return;
    }
    inputRefs.current[0]?.focus();
  }, [email]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const { mutate, isPending } = useMutation<
    VerifyEmailResponse,
    unknown,
    VerifyEmailData
  >({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      handleResponse({ successMsg: data.message });
      localStorage.setItem("isVerified", "true");
      if (data.token) localStorage.setItem("token", data.token);

      localStorage.removeItem("verifyEmail");
      navigate("/dashboard");
    },
    onError: (error) => handleResponse({ error }),
  });

  const handleVerify = (code: string) => {
    if (code.length !== 6) {
      handleResponse({ error: "Enter the full 6-digit code" });
      return;
    }
    mutate({ email, code });
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (updatedOtp.join("").length === 6) handleVerify(updatedOtp.join(""));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[#0A0A0F] font-sans">
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)] bg-[size:55px_55px] w-full h-full animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 text-white space-y-8">
        <h2 className="text-[22px] sm:text-[22px] font-bold text-center">
          Verify Your Email
        </h2>

        <p className="text-gray-300 text-center text-sm sm:text-base">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        {/* OTP INPUT BOXES */}
        {/* OTP INPUT BOXES */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((val, index) => (
            <input
              key={index}
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              className="
        w-9 h-11 
        sm:w-12 sm:h-14 
        md:w-14 md:h-16
        text-center text-lg 
        sm:text-xl md:text-2xl
        font-semibold 
        bg-black/20 border border-white/20 
        text-white rounded-xl
        focus:border-white outline-none
        transition-all
      "
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => handleVerify(otp.join(""))}
          disabled={isPending}
          className="w-full !py-4 !mb-7 rounded-xl text-[16px] bg-white !text-black hover:bg-gray-200"
        >
          {isPending ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            "Verify Email"
          )}
        </Button>

        {/* Resend */}
        <p className="text-center text-gray-400 text-xs sm:text-sm">
          Didn’t receive code? <ResendCode email={email} />{" "}
          {seconds > 0 && <span>({seconds}s)</span>}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
