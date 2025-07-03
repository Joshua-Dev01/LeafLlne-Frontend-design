import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { handleResponse } from "../../../../utils/handleErrors";
import { loginUser } from "../api/Login.api";

import { EyeIcon, EyeOffIcon } from "lucide-react";

// ✅ Zod schema for login
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
        successMsg: data.message || "Login successful!",
      });
      localStorage.setItem("token", data.token);
        localStorage.setItem("leafline_user", JSON.stringify(data.user)); 

      navigate("/dashboard");
    },
    onError: (error) => {
      handleResponse({ error });
    },
  });

  const onSubmit = (values: LoginData) => {
    mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* LOGO / Title */}
        <div>
          <p className="text-6xl">📚<span className="text-[18px] font-mono">LeafLine</span></p>
        </div>

        {/* Welcome text */}
        <p className="text-[20px] text-[#0d0c22] font-semibold">Welcome Back</p>
        <p className="text-sm text-gray-600">
          Login to your account to continue growing.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
              {/* Email */}
              <div className="space-y-1">
                <Input
                  id="email"
                  placeholder="Email address"
                  {...register("email")}
                  className="w-full p-5 rounded-lg shadow-md border  !text-[13px] border-gray-300"
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                    className="w-full p-5 rounded-lg shadow-md border  !text-[13px] border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-3 text-sm text-gray-500"
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-[#0d0c22] cursor-pointer  !text-[12px] !text-white"
              >
                {isPending ? "Logging in...." : "login"}
              </Button>
            </form>

            {/* Forgot password */}
            <p className="text-xs text-[#7b7194] text-center !mt-6 underline cursor-pointer">
              <Link to="/forgot-password">Forgot password?</Link>
            </p>

            {/* Sign up */}
            <p className="text-xs text-[#7b7194] text-center mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="underline ">
                Sign up
              </Link>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
