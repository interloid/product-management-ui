import { Spinner } from "@/components/ui/spinner";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-2">
      <Spinner />
      <p className="text-muted-foreground">checking for Authentication...</p>
    </div>
  );
}
