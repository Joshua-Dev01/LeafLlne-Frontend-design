import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { handleResponse } from "../../../../utils/handleErrors";
import { LoaderCircleIcon } from "lucide-react";
import { resendVerifyEmail } from "../api/verifyEmailApi";

interface Props {
  email: string;
}

const ResendCode = ({ email }: Props) => {
  const [countdown, setCountdown] = useState(0);

  // ✅ Countdown logic
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 100);

    return () => clearTimeout(timer);
  }, [countdown]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => resendVerifyEmail(email),
    onSuccess: () => {
      handleResponse({
        successCondition: true,
        successMsg: "Verification code resent ✅",
      });
      setCountdown(30); // 30-second cooldown
    },
    onError: (error) =>
      handleResponse({
        error,
      }),
  });

  return (
    <div className="text-center mt-4">
      {countdown > 0 ? (
        <p className="text-gray-400 text-xs">
          Resend available in {countdown}s
        </p>
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={() => mutate()}
          className="text-amber-200 text-sm underline hover:text-amber-100 disabled:opacity-40 cursor-pointer"
        >
          {isPending ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            "Resend Code"
          )}
        </button>
      )}
    </div>
  );
};

export default ResendCode;
