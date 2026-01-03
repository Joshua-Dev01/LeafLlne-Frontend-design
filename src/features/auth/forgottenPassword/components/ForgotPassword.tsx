import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/forgotPassword.api";
import { handleResponse } from "../../../../utils/handleErrors";
import { Link } from "react-router-dom";
import type { ForgotPasswordRequest } from "../../interface/Auth.interface";

import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      handleResponse({
        successCondition: true,
        successMsg: data.message,
      });
    },
    onError: (error) => handleResponse({ error }),
  });

  const onSubmit = (values: ForgotPasswordRequest) => mutate(values);

  return (
    <div className="min-h-screen w-full bg-[#0b0b10] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Back button */}
      {/* <button
        onClick={() => navigate("/auth/login")}
        className="absolute top-8 left-8 text-gray-300 hover:text-white flex items-center gap-1 text-xs cursor-pointer"
      >
        <ArrowLeft size={16} /> Back
      </button> */}
      {/* Background Grid Glow */}
      <div className="absolute inset-0 opacity-[0.15] blur-[1px]">
        <div
          className="bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)]
        bg-[size:50px_50px] w-full h-full animate-pulse"
        />
      </div>

      <div
        className="relative z-10 w-full max-w-lg p-10 rounded-3xl bg-[rgba(255,255,255,0.06)]
      backdrop-blur-2xl border border-white/10 shadow-[0px_0px_60px_rgba(0,0,0,0.4)] text-white"
      >
        {/* Logo */}
        {/* <div className="flex items-center justify-center mb-3">
          <img
            src={logo}
            alt="LeafLine Logo"
            className="w-16 h-16 rounded-full shadow-xl border border-white/20"
          />
        </div> */}

        <h2 className="text-[22px] font-bold text-center">Forgotten Password</h2>
        <p className="text-gray-300 text-xs text-center mt-2">
          Enter your registered email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Email Input */}
          <div>
            <Input
              {...register("email")}
              placeholder="Email address"
              className="w-full bg-black/20 border-white/20 text-white placeholder-gray-400 py-6"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            disabled={isPending}
            className="w-full !py-5 !rounded-xl !text-[15px]
            !bg-white !text-black hover:!bg-amber-50 !mb-5 !cursor-pointer"
          >
            {isPending ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </Button>

          {/* Login Link */}
          <p className="text-gray-300 text-xs text-center mt-10">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="text-white underline hover:text-amber-200"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
