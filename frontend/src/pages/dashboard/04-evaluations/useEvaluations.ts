import { api } from "@/api/config/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import type { Evaluation } from "./columns";

export const useGetEvaluations = () => {
  return useQuery({
    queryKey: ["evaluationsData"],
    queryFn: async () => await api.get<Evaluation>("/evaluations"),
  });
};
