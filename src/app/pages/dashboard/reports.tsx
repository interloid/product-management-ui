import { useNavigate } from "react-router-dom";
import { notifyToast } from "@/lib/toast";
import EmptyPage from "@/components/shad/empty-page";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function Reports() {
  const navigate = useNavigate();

  return (
    <EmptyPage
      icon={BarChart3}
      badge="Analytics Suite"
      title="Reports & Business Intelligence"
      description="Gain deep operational visibility into sales velocity, inventory turnover, gross margins, and revenue forecasts."
      features={[
        "Real-time revenue, gross margin, and stock burn-rate charts",
        "Predictive stock depletion dates and re-order triggers",
        "Scheduled automated CSV/PDF report delivery to team inboxes",
      ]}
    >
      <Button
        variant="default"
        onClick={() => navigate("/products")}
        className="cursor-pointer"
      >
        View Products
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          notifyToast(
            "info",
            "You've been added to the early access list for Reports & Analytics!",
          )
        }
        className="cursor-pointer"
      >
        Request Early Access
      </Button>
    </EmptyPage>
  );
}
