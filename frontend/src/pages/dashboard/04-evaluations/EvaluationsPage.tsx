import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/table/DataTable";
import { useState } from "react";
import { useAppSelector } from "@/hooks/reduxTypedHooks";
import { evaluationColumns } from "./columns";
import { useGetEvaluations } from "./useEvaluations";

export default function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const evaluations = useGetEvaluations();

  return (
    <div className="container mx-auto flex flex-col gap-4 p-6">
      <h1 className="mb-4 text-3xl font-bold">Evaluations</h1>

      {userRole !== "employee" && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsModalOpen(true)} className="w-fit">
              Create New Evaluation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Evaluation</DialogTitle>
            </DialogHeader>
            <DialogDescription>Create a new evaluation for employees</DialogDescription>
            <div className="-mt-4">{/* <UserForm onClose={() => setIsModalOpen(false)} /> */}</div>
          </DialogContent>
        </Dialog>
      )}

      {/* @ts-ignore */}
      <DataTable data={evaluations.data?.data || []} columns={evaluationColumns} />
    </div>
  );
}
