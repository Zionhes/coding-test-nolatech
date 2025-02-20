import { api } from "@/api/config/axiosConfig";
import { REGISTER_ENDPOINT } from "@/api/endpointsConstants";
import { useMutation } from "@tanstack/react-query";
import { RegisteSchema } from "../schema";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function usePostRegister() {
  const navigate = useNavigate();

  return useMutation({
    onSuccess: () => {
      navigate("/sucess-register");
      alert("Success");
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message as string;

      if (errMsg) toast.error(errMsg);
      else toast.error(error.message);

      throw error;
    },
    mutationFn: async (data: RegisteSchema) => {
      return await api.post(REGISTER_ENDPOINT, data);
    },
  });
}
