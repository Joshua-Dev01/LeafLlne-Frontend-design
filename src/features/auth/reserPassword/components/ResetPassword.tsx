import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { resetPassword } from "../api/resetPassword.api";
import { handleResponse } from "../../../../utils/handleErrors";

import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      handleResponse({ error: "Invalid or expired reset link" });
      navigate("/auth/forgot-password");
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      resetPassword({ token: token as string, password: data.password }),
    onSuccess: (data) => {
      handleResponse({ successCondition: true, successMsg: data.message });
      setTimeout(() => navigate("/auth/login"), 1500);
    },
    onError: (error) => handleResponse({ error }),
  });

  const onSubmit = (data: FormData) => mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b10] px-4 relative overflow-hidden">
      {/* Background Grid Glow */}
      <div className="absolute inset-0 opacity-[0.15] blur-[1px]">
        <div
          className="bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)]
          bg-[size:50px_50px] w-full h-full animate-pulse"
        />
      </div>

      {/* Container */}
      <div
        className="relative z-10 w-full max-w-lg p-10 rounded-3xl bg-[rgba(255,255,255,0.06)]
        backdrop-blur-2xl border border-white/10 shadow-[0px_0px_60px_rgba(0,0,0,0.4)] text-white"
      >
        <h2 className="text-[22px] font-bold text-center">Create New Password</h2>
        <p className="text-gray-300 text-xs text-center mt-2">
          Set a new password to regain access to your account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* New Password */}
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full bg-black/20 border-white/20 text-white placeholder-gray-400 py-6"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[18px] cursor-pointer"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </span>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full bg-black/20 border-white/20 text-white placeholder-gray-400 py-6"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[18px] cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={18} />
              ) : (
                <EyeIcon size={18} />
              )}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            disabled={isPending}
            className="w-full !py-5 !rounded-xl !text-[15px]
          !bg-white !text-black hover:!bg-amber-50 !mb-5 !cursor-pointer"
          >
            {isPending ? <LoaderCircleIcon className="animate-spin" /> : "Reset Password"}
          </Button>

          <p className="text-gray-300 text-xs text-center">
            Return to{" "}
            <Link
              to="/auth/login"
              className="text-white underline "
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
