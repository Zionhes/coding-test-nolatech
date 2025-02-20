import { Button } from "@/components/ui/button";
// import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/store/authSlice";

export type Evaluation = {
  evaluatedUser: User;
  evaluatorUser: User; // (Manager or Admin)
  questions: { questionId: string; score: number; comment?: string }[];
  submittedAt: Date;
  status: "pending" | "completed";
};

export const evaluationColumns: ColumnDef<Evaluation>[] = [
  {
    header: "Evaluated User",
    accessorKey: "evaluatedUser",
    accessorFn: (row) => `${row?.evaluatedUser?.firstName} ${row?.evaluatedUser?.lastName}`,
  },
  {
    header: "Evaluator",
    accessorKey: "evaluatorUser",
    accessorFn: (row) => `${row?.evaluatorUser?.firstName} ${row?.evaluatorUser?.lastName}`,
  },
  {
    accessorKey: "submittedAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <div className="flex space-x-2">
  //       {/* Edit Button */}
  //       <Dialog>
  //         <DialogTrigger asChild>
  //           <Button variant="outline" size="sm">
  //             <Pencil size={16} />
  //             Edit
  //           </Button>
  //         </DialogTrigger>
  //         <DialogContent>{/* <UserForm user={selectedUser} onClose={() => setSelectedUser(null)} /> */}</DialogContent>
  //       </Dialog>
  //
  //       {/* Delete button only if user is not admin */}
  //       {row.original.role !== "admin" && (
  //         <Dialog>
  //           <DialogTrigger asChild>
  //             <Button variant="destructive" size="sm">
  //               <Trash2 size={16} />
  //               Delete
  //             </Button>
  //           </DialogTrigger>
  //           <DialogContent>
  //             <p>Are you sure you want to delete {row.original.firstName}?</p>
  //             <Button variant="destructive" className="mt-4">
  //               Confirm
  //             </Button>
  //           </DialogContent>
  //         </Dialog>
  //       )}
  //     </div>
  //   ),
  // },
];
