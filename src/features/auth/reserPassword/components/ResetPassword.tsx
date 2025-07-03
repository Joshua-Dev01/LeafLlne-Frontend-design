import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { resetPassword } from "../api/resetPassword.api";
import { handleResponse } from "../../../../utils/handleErrors";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// ✅ Zod schema
const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);

  // 🚫 Redirect if no token
  useEffect(() => {
    if (!token) {
      handleResponse({ error: "Invalid or missing reset token." });
      navigate("/forgot-password");
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
      navigate("/login");
    },
    onError: (error) => {
      handleResponse({ error });
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* Header */}
        <div>
          <p className="text-6xl">📚<span className="text-[18px] font-mono">LeafLine</span></p>
        </div>

        <h2 className="text-[20px] !font-semibold text-[#0d0c22]">Reset Your Password</h2>
        <p className="text-sm text-gray-600">
          Enter a new password to recover access to your account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              {...register("password")}
              className="w-full p-5 rounded-lg shadow-md border !text-[13px] border-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[14px] text-gray-500"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#0d0c22] !text-[13px] !text-white rounded-full"
          >
            {isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        {/* Login link */}
        <p className="text-xs text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className=" underline">
            Go to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
