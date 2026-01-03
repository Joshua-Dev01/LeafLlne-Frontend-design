import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";

import { Input } from "../../../../components/ui/input";
import { handleResponse } from "../../../../utils/handleErrors";
import { loginUser } from "../api/Login.api";

import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";
import GoogleAuthButton from "../../googleAuth/GoogleLoginButton";
import { Button } from "../../../../components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      handleResponse({
        successCondition: true,
        successMsg: data.message || "Login successful",
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("leafline_user", JSON.stringify(data.user));
      navigate("/dashboard");
    },
    onError: (error) => handleResponse({ error }),
  });

  const onSubmit = (values: LoginData) => mutate(values);

  return (
    <div className="min-h-screen w-full bg-[#0b0b10] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15] blur-[1px]">
        <div className="bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)] bg-[size:50px_50px] w-full h-full animate-pulse" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg p-10 rounded-3xl
        bg-[rgba(255,255,255,0.06)]
        backdrop-blur-2xl border border-white/10
        shadow-[0px_0px_60px_rgba(0,0,0,0.4)] text-white"
      >
        <p className="text-[25px] font-bold mb-5 text-center">Welcome Back</p>

        <GoogleAuthButton />

        <div className="flex items-center w-full gap-3 my-5">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-gray-300 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <Input
              {...register("email")}
              placeholder="Email address"
              className="w-full bg-black/20 border-white/20 text-white placeholder-gray-400 py-6"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-black/20 border-white/20 text-white placeholder-gray-400 py-6"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-300"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <Button
            disabled={isPending}
            className="w-full !py-5 !mb-6 !rounded-xl !text-[18px] !font-medium cursor-pointer !bg-white !text-black hover:!bg-amber-50"
          >
            {isPending ? <LoaderCircleIcon className="animate-spin" /> : "Login"}
          </Button>
        </form>

        {/* Forgot Password + Signup Link */}
        <p className="text-gray-300 text-[14px] text-center mt-6 underline cursor-pointer">
          <Link to="/auth/forgot-password">Forgot password?</Link>
        </p>

        <p className="text-gray-300 text-[14px] text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/auth/signup" className="text-white underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
