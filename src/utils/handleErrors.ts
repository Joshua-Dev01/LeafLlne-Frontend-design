import { toast } from "sonner";

interface HandleResponseOptions {
  error?: any;
  successMsg?: string;
  successCondition?: boolean;
}

export const handleResponse = ({ error, successMsg, successCondition }: HandleResponseOptions) => {
  if (error) {
    console.error("API Error:", error);

    const backendMessage =
      error?.response?.data?.message ||
      (Array.isArray(error?.response?.data?.errors) &&
        error.response.data.errors[0]?.msg) ||
      error?.message ||
      "Something went wrong. Please try again.";

    toast.error(backendMessage);
  }

  if (successCondition && successMsg) {
    toast.success(successMsg);
  }
};
