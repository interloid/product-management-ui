import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { loginWithProvider } from "@/services/auth-service";
import { useAuth } from "@/hooks/use-auth";
import GoogleLogo from "@/components/icons/google-logo";
import GithubLogo from "@/components/icons/github-logo";
import MicrosoftLogo from "@/components/icons/microsoft-logo";
import { AlertTriangle, CircleAlert, Eye, EyeOff } from "lucide-react";
import { type OAuthProvider } from "@/types/auth";
import { getUserFriendlyErrorMessage } from "@/lib/errors";
import { validateEmail } from "@/lib/validation";
import interloidLogo from "@/assets/icons/interloid.ico";

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [providerLoading, setProviderLoading] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handlePasswordKeyEvent = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "CapsLock") {
      if (event.repeat) return;
      if (event.type === "keydown") {
        setIsCapsLockOn(!event.getModifierState("CapsLock"));
      }
      return;
    }
    if (event.type === "keydown" && event.key.length === 1) {
      const isUpper = event.key >= "A" && event.key <= "Z";
      const isLower = event.key >= "a" && event.key <= "z";
      if (isUpper || isLower) {
        setIsCapsLockOn(isUpper !== event.shiftKey);
        return;
      }
    }
    if (typeof event.getModifierState === "function") {
      setIsCapsLockOn(event.getModifierState("CapsLock"));
    }
  };

  const validatePassword = (value: string): string | null => {
    if (!value) {
      return "Please enter your password.";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (value.length > 128) {
      return "Password must be 128 characters or fewer.";
    }
    return null;
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setEmail(val);
    if (formError) {
      setFormError(null);
    }
    if (emailError) {
      const err = validateEmail(val);
      setEmailError(err ?? "");
    }
  };

  const handleEmailBlur = () => {
    const err = validateEmail(email);
    setEmailError(err ?? "");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setPassword(val);
    if (formError) {
      setFormError(null);
    }
    if (passwordError) {
      const err = validatePassword(val);
      setPasswordError(err ?? "");
    }
  };

  const handlePasswordBlur = () => {
    const err = validatePassword(password);
    setPasswordError(err ?? "");
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormError(null);

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setEmailError(eErr ?? "");
    setPasswordError(pErr ?? "");

    if (eErr || pErr) {
      return;
    }

    setLoading(true);
    try {
      await login({
        email: email.trim(),
        password,
        remember_me: rememberMe,
      });

      if (typeof window !== "undefined") {
        sessionStorage.setItem("login_success", "true");
      }

      const from =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? "/products";

      navigate(from, {
        replace: true,
        state: { loginSuccess: true },
      });
    } catch (error) {
      const message = getUserFriendlyErrorMessage(
        error,
        "Unable to sign in. Please try again.",
        { context: "login" },
      );
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = (provider: OAuthProvider) => {
    setProviderLoading(provider);
    loginWithProvider(provider);

    window.setTimeout(
      () =>
        setProviderLoading((current) =>
          current === provider ? null : current,
        ),
      15_000,
    );
  };

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setProviderLoading(null);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center p-4 sm:p-6 md:p-10">
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
      <div className="w-full border rounded-[10px] max-w-lg">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="gap-4 px-2 py-8 rounded-[10px] shadow-[rgba(0,0,0,0.04)_0px_1px_2px]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
              <CardDescription className="text-muted-text">
                Use your workspace account, or a provider.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup className="gap-2!">
                  <Field className="flex-col h-fit py-1 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 text-xs hover:bg-primary-hover"
                      disabled={providerLoading !== null}
                      onClick={() => handleProviderLogin("google")}
                    >
                      {providerLoading === "google" ? (
                        <>
                          <Spinner className="size-4" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <GoogleLogo />
                          <span>Continue with Google</span>
                        </>
                      )}
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 flex-1 text-xs hover:bg-primary-hover"
                        disabled={providerLoading !== null}
                        onClick={() => handleProviderLogin("github")}
                      >
                        {providerLoading === "github" ? (
                          <>
                            <Spinner className="size-4" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <GithubLogo />
                            GitHub
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 flex-1 text-xs hover:bg-primary-hover"
                        disabled={providerLoading !== null}
                        onClick={() => handleProviderLogin("microsoft")}
                      >
                        {providerLoading === "microsoft" ? (
                          <>
                            <Spinner className="size-4" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <MicrosoftLogo />
                            Microsoft
                          </>
                        )}
                      </Button>
                    </div>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-[11px] py-1">
                    <span className="px-1"> OR </span>
                  </FieldSeparator>
                  {formError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3.5 text-left dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in-50 duration-200"
                    >
                      <CircleAlert className="size-4 shrink-0 text-[#e63f3b] dark:text-red-400 mt-0.5" />
                      <p className="text-[13px] font-semibold text-[#e63f3b] dark:text-red-400 leading-snug">
                        {formError}
                      </p>
                    </div>
                  )}

                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="email"
                      className="text-[13px] font-medium"
                    >
                      Email
                    </FieldLabel>

                    <Input
                      id="email"
                      type="email"
                      maxLength={254}
                      value={email}
                      autoComplete="username"
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      required
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={emailError ? "email-error" : undefined}
                      className={cn(
                        "h-10 px-3! text-[13px]! focus-visible:ring-primary/20",
                        emailError
                          ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                          : "focus-visible:border-primary",
                      )}
                    />

                    {emailError && (
                      <p
                        id="email-error"
                        className="text-xs font-medium text-destructive mt-0.5"
                        role="alert"
                      >
                        {emailError}
                      </p>
                    )}
                  </Field>
                  <Field className="gap-1.5">
                    <div className="flex items-center">
                      <FieldLabel
                        htmlFor="password"
                        className="text-[13px] font-medium"
                      >
                        Password
                      </FieldLabel>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        maxLength={128}
                        value={password}
                        onChange={handlePasswordChange}
                        onKeyDown={handlePasswordKeyEvent}
                        onKeyUp={handlePasswordKeyEvent}
                        onBlur={handlePasswordBlur}
                        autoComplete="current-password"
                        required
                        aria-invalid={Boolean(passwordError)}
                        aria-describedby={
                          passwordError ? "password-error" : undefined
                        }
                        className={cn(
                          "h-10 pl-3.5! pr-10! text-[13px]! focus-visible:ring-primary/20",
                          showPassword
                            ? "tracking-normal"
                            : "tracking-[5px] font-bold",
                          passwordError
                            ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                            : "focus-visible:border-primary",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-text hover:text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        <span className="text-xs font-medium">
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-text" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-text" />
                          )}
                        </span>
                      </button>
                    </div>
                    {passwordError && (
                      <p
                        id="password-error"
                        className="text-xs font-medium text-destructive mt-0.5"
                        role="alert"
                      >
                        {passwordError}
                      </p>
                    )}
                    {isCapsLockOn && (
                      <div
                        role="status"
                        aria-live="polite"
                        className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400"
                      >
                        <AlertTriangle className="size-3.5 shrink-0" />
                        <span>Caps Lock is on</span>
                      </div>
                    )}
                  </Field>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-xs font-normal text-muted-text leading-none peer-disabled:cursor-not-allowed cursor-pointer peer-disabled:opacity-70"
                    >
                      Keep me signed in on this device
                    </label>
                  </div>
                  <Field>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 text-sm font-semibold transition-colors disabled:opacity-60 border-none"
                    >
                      {loading ? (
                        <>
                          <Spinner className="size-4" />
                          Checking...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>

                    <FieldDescription className="text-center text-xs">
                      Have a Passcode instead?{" "}
                      <Link
                        to="/passcode"
                        className="text-primary font-semibold no-underline! hover:underline!"
                      >
                        Use Passcode
                      </Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
