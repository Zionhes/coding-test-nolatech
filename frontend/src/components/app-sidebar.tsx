import * as React from "react";

import { NavItems } from "@/components/nav-items";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { privates } from "@/routes/pathConstants";
import Image from "../assets/nolatech-logo.jpg";
import { useAppSelector } from "@/hooks/reduxTypedHooks";
import { Badge } from "./ui/badge";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={privates.DASHBOARD}>
                <div className="aspect-square size-8 overflow-hidden rounded-lg bg-cover">
                  <img src={Image} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nolatech</span>
                  <span className="truncate text-xs">Coding test</span>
                </div>
                <Badge className="rounded-full shadow-none">
                  {user ? user?.role.charAt(0).toUpperCase() + user?.role.slice(1) : "not logged"}
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavItems />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
    </Sidebar>
  );
}
