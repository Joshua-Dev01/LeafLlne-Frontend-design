import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";

import { registerUser } from "../api/register.api";
import { handleResponse } from "../../../../utils/handleErrors";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";
import GoogleAuthButton from "../../googleAuth/GoogleLoginButton";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";

// ✅ Validation Schema
const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string().min(6, "Min 6 characters"),
    accountType: z.enum(["Education", "Business", "Personal"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  // ✅ Register API
  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const email = data?.user?.email;

      if (email) {
        localStorage.setItem("verifyEmail", email);
        navigate("/auth/verify-email", { state: { email } });
      }

      handleResponse({
        successCondition: true,
        successMsg: "Account created ✅ Check your email",
      });

      reset();
    },
    onError: (error) => handleResponse({ error }),
  });

  const onSubmit = (values: RegisterData) => mutate(values);

  return (
    <div className="min-h-screen w-full bg-[#0b0b10] flex items-center justify-center px-4 relative overflow-hidden ">
      <div className="absolute inset-0 opacity-[0.15] blur-[1px]">
        <div className="bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)] bg-[size:50px_50px] w-full h-full animate-pulse" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg p-10 rounded-3xl mt-10
        bg-[rgba(255,255,255,0.06)]
        backdrop-blur-2xl border border-white/10
        shadow-[0px_0px_60px_rgba(0,0,0,0.4)] text-white"
      >
        <p className="text-[25px] font-bold mb-5">Sign Up</p>

        <GoogleAuthButton />

        <div className="flex items-center gap-3 w-full my-5">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-gray-300 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name + Email - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name */}
            <div>
              <Input
                {...register("name")}
                placeholder="Full Name"
                className="w-full bg-black/20 border-white/20 text-white placeholder-gray-400 py-6"
              />
              {errors.name && (
                <p className="text-red-400 text-xs">{errors.name.message}</p>
              )}
            </div>

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
          </div>

          {/* Password + Confirm Password - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full bg-black/20 border-white/20 text-white placeholder-gray-400 py-6"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-4 text-gray-300"
              >
                {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Account Type Select */}
          <div>
            <Select
              onValueChange={(value) =>
                setValue("accountType", value as RegisterData["accountType"])
              }
            >
              <SelectTrigger className="w-full bg-black/20 border-white/20 text-white py-6 focus:ring-2 focus:ring-white/30 cursor-pointer">
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>

              <SelectContent className="bg-[#111] text-white border-white/20">
                <SelectItem
                  value="Education"
                  className="hover:bg-white/10 cursor-pointer"
                >
                  Education
                </SelectItem>
                <SelectItem
                  value="Business"
                  className="hover:bg-white/10 cursor-pointer"
                >
                  Business
                </SelectItem>
                <SelectItem
                  value="Personal"
                  className="hover:bg-white/10 cursor-pointer"
                >
                  Personal
                </SelectItem>
              </SelectContent>
            </Select>

            {errors.accountType && (
              <p className="text-red-400 text-xs mt-1">
                {errors.accountType.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            disabled={isPending}
            className="w-full !py-5 !mb-5 !rounded-xl !text-[18px] !font-medium !transition hover:!bg-amber-50 cursor-pointer bg-white !text-black"
          >
            {isPending ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        <p className="text-gray-300 text-xs text-center mt-7">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-white underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
