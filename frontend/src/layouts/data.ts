import { User2, ContactRound, NotebookPen } from "lucide-react";
import { privates } from "@/routes/pathConstants";

export const sidebarItems = [
  // {
  //   title: "Home",
  //   url: privates.DASHBOARD,
  //   icon: House,
  // },
  {
    title: "Users",
    url: privates.USERS,
    icon: User2,
    roles: ["admin", "manager"],
  },

  {
    title: "Employees",
    url: privates.EMPLOYEES,
    icon: ContactRound,
    roles: "manager",
  },
  {
    title: "Evaluations",
    url: privates.EVALUATIONS,
    icon: NotebookPen,
    roles: ["admin", "manager", "employee"],
  },
  // {
  //   title: "Reports",
  //   url: privates.REPORTS,
  //   icon: NotebookText,
  // },
];
