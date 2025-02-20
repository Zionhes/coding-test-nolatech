import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { User } from "./queries/useUsers";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <Badge>{row.getValue("role")}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        {/* Edit Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Pencil size={16} />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>{/* <UserForm user={selectedUser} onClose={() => setSelectedUser(null)} /> */}</DialogContent>
        </Dialog>

        {/* Delete button only if user is not admin */}
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
