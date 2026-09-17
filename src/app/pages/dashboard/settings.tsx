import { useNavigate } from "react-router-dom";
import EmptyPage from "@/components/shad/empty-page";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <EmptyPage
      icon={SettingsIcon}
      badge="Workspace Admin"
      title="Settings & Preferences"
      description="Manage workspace security, developer API tokens, team member roles, and third-party webhook integrations."
      features={[
        "Granular team role-based access control (RBAC)",
        "API keys, webhook endpoints, and developer sandboxes",
        "Single Sign-On (SSO) and multi-factor authentication (MFA)",
      ]}
    >
      <Button
        variant="default"
        onClick={() => navigate("/products")}
        className="cursor-pointer"
      >
        Back to Products
      </Button>
    </EmptyPage>
  );
}
