import { api } from "@/api/config/axiosConfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "employee";
  createdAt: string;
  updatedAt: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/auth/users");
  return data;
};

export const useGetUsers = () => {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
};

// 📌 Mutaciones para crear, actualizar y eliminar usuarios
export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: (newUser: Partial<User>) => api.post("auth/register", newUser),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("New user created successfully");
    },
    onError: (error) => {
      //@ts-ignore
      toast.error(error.response?.data?.message);
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, user }: { id: string; user: Partial<User> }) => api.put(`/employees/${id}`, user),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => api.delete(`/employees/${id}`),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return { createUser, updateUser, deleteUser };
};
