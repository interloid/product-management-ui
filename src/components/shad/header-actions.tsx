import type { HeaderActionsProps } from "@/types/props";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutDialog } from "./logout-dialog";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { resolveApiUrl } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HeaderActions({ user }: HeaderActionsProps) {
  const initials = getInitials(user?.name ?? "");
  const avatarSrc = resolveApiUrl(user?.avatar);

  return (
    <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:w-3/4 lg:w-3/4 xl:w-3/4 2xl:w-1/2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="hidden size-9 cursor-default lg:flex">
            <AvatarImage src={avatarSrc} alt={user?.name ?? "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          align="end"
          sideOffset={6}
          className="flex-col items-start gap-1"
        >
          <p className="text-sm font-medium leading-tight">{user?.name}</p>
          <p className="text-xs leading-tight text-muted-foreground">
            {user?.email}
          </p>
        </TooltipContent>
      </Tooltip>

      <LogoutDialog
        trigger={
          <Button
            variant="destructive"
            className="cursor-pointer bg-cancel-button-background px-2.5 text-sm text-white hover:bg-destructive! sm:px-3"
          >
            Log out
          </Button>
        }
      />
    </div>
  );
}
