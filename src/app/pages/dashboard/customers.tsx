import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyPage from "@/components/shad/empty-page";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function Customers() {
  const navigate = useNavigate();

  return (
    <EmptyPage
      icon={Users}
      badge="Target Q4"
      title="Customer Management (CRM)"
      description="Manage customer profiles, purchase histories, communication logs, and customer segments in one hub."
      features={[
        "Customer lifetime spend & repeat purchase frequency metrics",
        "Order timelines, refund history, and saved billing addresses",
        "Customer group segmentation for personalized promotions",
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
        onClick={() => toast.info("You've been added to the early access list for Customers!")}
        className="cursor-pointer"
      >
        Join Beta Waitlist
      </Button>
    </EmptyPage>
  );
}
