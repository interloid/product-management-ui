import { Link } from "react-router-dom";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-l-none bg-background">
      <div className="flex min-h-14 flex-col-reverse items-center justify-between gap-2 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
        <p>© {new Date().getFullYear()} Product Management System</p>
        <div className="flex items-center gap-4">
          <Link to="/help" className="transition-colors hover:text-foreground">
            Help
          </Link>
          <Link
            to="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="hidden sm:inline">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
