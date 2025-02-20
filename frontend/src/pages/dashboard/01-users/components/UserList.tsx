import { useState } from "react";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import UserForm from "./UserForm";
import { useAppSelector } from "@/hooks/reduxTypedHooks";
import { useGetUsers } from "../queries/useUsers";

const UserList = () => {
  const { data: users, isLoading, error } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const currentUser = useAppSelector((state) => state.auth.user); // 📌 Obtener usuario autenticado

  // 📌 Filtrar para que un admin no se vea a sí mismo ni a otros admins
  const filteredUsers =
    users?.filter(
      (user) => !(currentUser?.role === "admin" && (user._id === currentUser._id || user.role === "admin")),
    ) || [];

  const columns: ColumnDef<any>[] = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {/* 📌 Botón de Editar */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(row.original)}>
                <Pencil size={16} />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UserForm user={selectedUser} onClose={() => setSelectedUser(null)} />
            </DialogContent>
          </Dialog>

          {/* 📌 Botón de Eliminar (Solo si el usuario no es admin) */}
          {row.original.role !== "admin" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 size={16} />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <p>Are you sure you want to delete {row.original.firstName}?</p>
                <Button variant="destructive" className="mt-4">
                  Confirm
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading users</p>;

  return <DataTable columns={columns} data={filteredUsers} searchKey="email" />;
};

export default UserList;
