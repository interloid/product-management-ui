import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifyToast } from "@/lib/toast";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { getUserFriendlyErrorMessage } from "@/lib/errors";
import type { LogoutDialogProps } from "@/types/props";

export function LogoutDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: LogoutDialogProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isLoggingOut) {
      return;
    }
    if (!nextOpen) {
      setLogoutAllDevices(false);
    }
    if (isControlled) {
      setControlledOpen?.(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout({ allDevices: logoutAllDevices });
      handleOpenChange(false);
      // Do not rely on the route guard alone: logout must leave the dashboard
      // on builds where ProtectedRoute is not mounted.
      navigate("/login", { replace: true });
    } catch (error) {
      notifyToast(
        "error",
        getUserFriendlyErrorMessage(
          error,
          "Unable to log out right now. Please try again.",
        ),
        {
          id: "logout-failed",
          description: "You are still signed in. Please try again in a moment.",
        },
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={!isLoggingOut}
        onPointerDownOutside={(e) => {
          if (isLoggingOut) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isLoggingOut) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-[16px]">
            Are you sure you want to log out?
          </DialogTitle>

          <DialogDescription>
            You will be signed out of your account and redirected to the login
            page.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2.5 py-1">
          <Checkbox
            id="logout-all-devices"
            checked={logoutAllDevices}
            onCheckedChange={(checked) => setLogoutAllDevices(Boolean(checked))}
            disabled={isLoggingOut}
          />
          <label
            htmlFor="logout-all-devices"
            className="text-xs font-medium text-muted-foreground cursor-pointer select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sign out of all devices and active sessions
          </label>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isLoggingOut}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="cursor-pointer"
          >
            {isLoggingOut && <Spinner className="mr-2 size-4" />}
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
