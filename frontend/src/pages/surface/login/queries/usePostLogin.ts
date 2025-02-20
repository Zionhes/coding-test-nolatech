import { api } from "@/api/config/axiosConfig";
import { useMutation } from "@tanstack/react-query";
import type { LoginSchema } from "../form/schema";
import { LOGIN_ENDPOINT } from "@/api/endpointsConstants";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { privates } from "@/routes/pathConstants";
import { useAppDispatch } from "@/hooks/reduxTypedHooks";
import { setCredentials, type User } from "@/store/authSlice";
import type { AxiosResponse } from "axios";

export function usePostLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    onSuccess: async (data: AxiosResponse<User>) => {
      dispatch(setCredentials(data.data));

      navigate(privates.DASHBOARD);
    },
    onError: (error) => {
      //@ts-ignore
      const errMsg = error.response?.data?.message as string;
      if (errMsg) toast.error(errMsg);
      else toast.error(error.message);
      throw error;
    },
    mutationFn: async (data: LoginSchema) => {
      return await api.post(LOGIN_ENDPOINT, data);
    },
  });
}
