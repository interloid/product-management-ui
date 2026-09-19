import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import type { HeaderActionsProps } from "@/types/props";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutDialog } from "./logout-dialog";
import { getInitials } from "@/lib/utils";
import { resolveApiUrl } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeaderActions({ user }: HeaderActionsProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const initials = getInitials(user?.name ?? "");
  const avatarSrc = resolveApiUrl(user?.avatar);

  return (
    <div className="ml-auto flex shrink-0 items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group flex items-center gap-2 rounded-full p-0.5 outline-hidden cursor-pointer"
            aria-label="User menu"
          >
            <Avatar className="size-8.5 border border-border/80 shadow-xs transition-all duration-200 group-hover:border-primary group-hover:ring-2 group-hover:ring-primary/20 group-focus-visible:border-primary group-focus-visible:ring-2 group-focus-visible:ring-primary/20">
              <AvatarImage src={avatarSrc} alt={user?.name ?? "User"} />
              <AvatarFallback className="text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-md">
          <DropdownMenuLabel className="p-2 font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none text-foreground">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/settings" className="flex items-center gap-2 hover:bg-primary-hover!">
              <Settings className="size-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setShowLogoutDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
          >
            <LogOut className="size-4 mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </div>
  );
}
