import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/forgotPassword.api";
import { handleResponse } from "../../../../utils/handleErrors";
import { Link, useNavigate } from "react-router-dom";
import type { ForgotPasswordRequest } from "../../interface/Auth.interface";

import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

// Zod schema
const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const navigate = useNavigate();

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
    onError: (error) => {
      handleResponse({ error });
    },
  });

  const onSubmit = (values: ForgotPasswordRequest) => {
    mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* 🔙 Back */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-6 left-6 flex items-center text-sm text-green-700 hover:underline"
        >
          <ArrowLeft className="mr-1 cursor-pointer" size={18} />
          
        </button>

        {/* 💬 Title */}
        <div>
          <p className="text-6xl">📚<span className="text-[18px] font-mono">LeafLine</span></p>
        </div>

        <h2 className="text-[20px] text-[#0d0c22] !font-semibold">Forgot Password 💬</h2>
        <p className="text-sm text-gray-600">
          Enter your email to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          <div className="space-y-1">
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full p-5 rounded-lg shadow-md border !text-[13px] border-gray-300"
            />
            {errors.email && (
              <p className="text-xs text-red-600 !mt-2">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#0d0c22] !text-white !text-[12px] rounded-full cursor-pointer"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>

          <p className="text-xs text-center text-gray-600  !mt-6">
            Remember your password?{" "}
            <Link to="/login" className="underline text-blue-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
