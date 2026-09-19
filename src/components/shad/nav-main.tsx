import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavMainProps } from "@/types/props";

export function NavMain({ items }: NavMainProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="w-full group-data-[collapsible=icon]:px-0 p-0">
      <SidebarGroupContent className="w-full pt-3 p-2">
        <SidebarMenu className="w-full items-center gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem
                key={item.title}
                className="w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
              >
                <NavLink
                  to={item.url}
                  onClick={() => {
                    setOpenMobile(false);
                    if (item.url === "/categories") {
                      window.dispatchEvent(
                        new CustomEvent("refresh-categories"),
                      );
                    }
                  }}
                  className="block w-full group-data-[collapsible=icon]:w-10"
                >
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "relative w-full gap-2 hover:bg-primary-hover hover:text-hover-text",
                        "data-[active=true]:bg-primary",
                        "data-[active=true]:text-primary-foreground",
                        "data-[active=true]:hover:bg-primary",
                        "data-[active=true]:hover:text-primary-foreground",
                        "data-[active=true]:before:absolute",
                        "data-[active=true]:before:left-0",
                        "data-[active=true]:before:top-1",
                        "data-[active=true]:before:bottom-1",
                        "data-[active=true]:before:w-1",
                        "data-[active=true]:before:rounded-r-full",
                        "data-[active=true]:before:bg-primary-foreground",
                        "data-[active=true]:before:shadow-[0_0_6px_1px_var(--primary-foreground)]",
                        "group-data-[collapsible=icon]:data-[active=true]:before:hidden",
                        "group-data-[collapsible=icon]:mx-auto",
                        "group-data-[collapsible=icon]:size-10",
                        "group-data-[collapsible=icon]:justify-center",
                        "group-data-[collapsible=icon]:p-0",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
