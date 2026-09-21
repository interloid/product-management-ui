import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifyToast } from "@/lib/toast";
import { requestPasscode } from "@/services/auth-service";
import { cn } from "@/lib/utils";
import { validateEmail } from "@/lib/validation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getUserFriendlyErrorMessage } from "@/lib/errors";
import interloidLogo from "@/assets/icons/interloid.ico";

export default function PasscodeRequestPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setEmail(val);
    if (emailError) {
      const err = validateEmail(val);
      setEmailError(err ?? "");
    }
  };

  const handleEmailBlur = () => {
    const err = validateEmail(email);
    setEmailError(err ?? "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");

    const trimmedEmail = email.trim();

    try {
      setIsLoading(true);

      const response = await requestPasscode(trimmedEmail);
      if (!response.success) {
        notifyToast(
          "error",
          response.message || "Unable to send the passcode. Please try again.",
          { id: "passcode-send-failed" },
        );
        return;
      }
      notifyToast("success", "Passcode sent successfully.", {
        id: "passcode-sent",
      });
      navigate("/passcode/verify", {
        state: {
          email: trimmedEmail,
        },
      });
    } catch (error) {
      notifyToast(
        "error",
        getUserFriendlyErrorMessage(
          error,
          "Unable to send the passcode. Please try again.",
        ),
        { id: "passcode-request-failed" },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-center gap-2 sm:absolute sm:right-8 sm:bottom-8 sm:mb-0 sm:justify-start">
          <span className="text-sm font-light text-muted-foreground">
            Powered by{" "}
          </span>
          <div className="flex">
            <img
              src={interloidLogo}
              alt="interloid"
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
            <span className="text-sm font-semibold">Interloid</span>
          </div>
        </div>
        <Card className="w-full p-8 border rounded-[10px] shadow-[rgba(0,0,0,0.04)_0px_1px_2px]">
          <Tabs defaultValue="Passcode" className="w-full">
            <TabsList className="h-10! w-full">
              <TabsTrigger
                value="Username"
                className="h-8! flex-1 text-xs"
                onClick={() => navigate("/login")}
              >
                Username
              </TabsTrigger>
              <TabsTrigger value="Passcode" className="h-8! flex-1 text-xs">
                Passcode
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={handleSubmit} className="w-full" noValidate>
            <CardHeader className="px-1">
              <CardTitle className="text-lg font-bold">
                Get your passcode
              </CardTitle>
              <CardDescription>
                Enter your email address to receive your six-digit passcode.
              </CardDescription>
            </CardHeader>
            <Field className="w-full px-1 py-4">
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                maxLength={254}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                disabled={isLoading}
                autoComplete="email"
                required
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "email-error" : undefined}
                className={cn(
                  "h-10 text-[13px]! focus-visible:ring-primary/20",
                  emailError
                    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                    : "focus-visible:border-primary",
                )}
              />

              {emailError ? (
                <p
                  id="email-error"
                  className="text-xs font-medium text-destructive mt-0.5"
                  role="alert"
                >
                  {emailError}
                </p>
              ) : (
                <FieldDescription>
                  We'll send a six-digit passcode to this email address.
                </FieldDescription>
              )}
            </Field>

            <CardFooter className="flex w-full flex-col gap-2 px-2">
              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="h-10 w-full"
              >
                {isLoading ? (
                  <>
                    <Spinner className="size-4" />
                    Sending...
                  </>
                ) : (
                  "Send Passcode"
                )}
              </Button>
              <CardDescription className="px-1 pt-2 text-center text-xs text-muted-text">
                You will be redirected to the verification page after requesting
                the passcode.
              </CardDescription>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
