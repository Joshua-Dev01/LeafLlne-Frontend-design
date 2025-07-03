import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

// API and utils
import { registerUser } from "../api/register.api";
import { handleResponse } from "../../../../utils/handleErrors";

// UI Components
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

// Assets
import { EyeIcon, EyeOffIcon } from "lucide-react";

// Schema
const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
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
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      handleResponse({
        successCondition: true,
        successMsg: data.message || "Registration successful!",
      });
              localStorage.setItem("leafline_user", JSON.stringify(data.user)); 

      
      reset();
      navigate("/dashboard");
    },
    onError: (error) => {
      handleResponse({ error });
    },
  });

  const onSubmit = (values: RegisterData) => {
    mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center space-y-2">
        {/* LOGO */}
        <div className="">
          {/* <img src={logo} alt="LeafLine Logo" className="w-36" /> */}
          <p className="text-6xl ">📚<span className="text-[18px] font-mono ">LeafLine</span></p>
        </div>

        {/* Welcome text */}
        <p className="text-[20px] font text-[#0d0c22]">Welcome to LeafLine</p>
        <p className="text-sm text-gray-600">
          Create your account and empower your mindset.
        </p>


        <AnimatePresence mode="wait">
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 text-left">
              {/* Name */}
              <div className="space-y-1">
                <Input
                  id="name"
                  placeholder="Full Name"
                  {...register("name")}
                  className="w-full p-5 rounded-lg !text-[13px] shadow-md border border-gray-300"
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Input
                  id="email"
                  placeholder="Email address"
                  {...register("email")}
                  className="w-full p-5 rounded-lg !text-[13px] shadow-md border border-gray-300"
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
                    className="w-full p-5 rounded-lg !text-[13px] shadow-md border border-gray-300"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                    className="w-full p-5 rounded-lg !text-[13px] shadow-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-2 top-3 text-sm text-gray-500"
                  >
                    {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full  !text-[12px] bg-[#0d0c22] !mb-6 cursor-pointer !text-white "
              >
                {isPending ? "Signing Up..." : "Continue"}
              </Button>
            </form>



            {/* Switch to login */}
            <p className="text-xs text-[#7b7194] text-center">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Register;
