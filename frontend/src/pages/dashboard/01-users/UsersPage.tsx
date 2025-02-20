import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { columns } from "./columns";
import { useGetUsers } from "./queries/useUsers";
import { DataTable } from "@/components/table/DataTable";
import UserForm from "./components/UserForm";
import { useState } from "react";

export default function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const users = useGetUsers();

  return (
    <div className="container mx-auto flex flex-col gap-4 p-6">
      <h1 className="mb-4 text-3xl font-bold">Manage Users</h1>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsModalOpen(true)} className="w-fit">
            Create New User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <DialogDescription>Create a new user in the system</DialogDescription>
          <div className="-mt-4">
            <UserForm onClose={() => setIsModalOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <DataTable data={users.data || []} columns={columns} />
    </div>
  );
}
