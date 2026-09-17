import { useState } from "react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveApiUrl } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { AuthUser } from "@/types/auth";
import { LogoutDialog } from "./logout-dialog";
import { getInitials } from "@/lib/utils";

export function NavUser({ user }: { user: AuthUser | null }) {
  const { state } = useSidebar();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const initials = getInitials(user?.name ?? "");
  const avatarSrc = resolveApiUrl(user?.avatar);
  const [prevAvatarSrc, setPrevAvatarSrc] = useState(avatarSrc);

  if (avatarSrc !== prevAvatarSrc) {
    setPrevAvatarSrc(avatarSrc);
    setAvatarError(false);
  }

  return (
    <SidebarMenu className="ml-0">
      <SidebarMenuItem className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-primary-hover! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                {avatarSrc && !avatarError && (
                  <AvatarImage
                    src={avatarSrc}
                    alt={user?.name ?? ""}
                    onError={() => setAvatarError(true)}
                  />
                )}
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {state === "expanded" && (
                <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>

                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align={state === "collapsed" ? "center" : "start"}
            className="w-56"
          >
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setShowLogoutDialog(true)}
              className="cursor-pointer text-cancel-button-background hover:text-destructive!"
            >
              <LogOut className="mr-2 size-4 hover:text-destructive!" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <LogoutDialog
          open={showLogoutDialog}
          onOpenChange={setShowLogoutDialog}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
