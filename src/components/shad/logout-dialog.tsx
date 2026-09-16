import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isLoggingOut) {
      return;
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
      await logout();
      handleOpenChange(false);
      // Do not rely on the route guard alone: logout must leave the dashboard
      // on builds where ProtectedRoute is not mounted.
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(getUserFriendlyErrorMessage(error, "Failed to log out"), {
        description: "You are still signed in. Please try again.",
      });
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
            className="cursor-pointer bg-cancel-button-background/85 text-white hover:bg-destructive"
          >
            {isLoggingOut && <Spinner className="mr-2 size-4" />}
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
