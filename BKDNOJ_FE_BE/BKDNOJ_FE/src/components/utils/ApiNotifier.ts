import { toast } from "react-toastify";

export const notifySuccess = (message: string) => {
  toast.success(message);
};

export const notifyError = (message: string) => {
  toast.error(message);
};

export const handleApiResponse = async <T>(promise: Promise<T>, successMessage?: string) => {
  try {
    const result = await promise;
    if (successMessage) {
      notifySuccess(successMessage);
    }
    return result;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "An unexpected error occurred.";
    notifyError(message);
    throw err;
  }
};
