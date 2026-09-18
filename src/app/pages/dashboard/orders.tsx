import { useNavigate } from "react-router-dom";
import { notifyToast } from "@/lib/toast";
import EmptyPage from "@/components/shad/empty-page";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();

  return (
    <EmptyPage
      icon={ShoppingCart}
      badge="Target Q4"
      title="Orders & Fulfillment"
      description="Track customer purchases, invoice generation, payment confirmations, and warehouse delivery workflows."
      features={[
        "Real-time order lifecycle tracking & customer notifications",
        "Automated PDF packing slips and printable tax invoices",
        "Carrier integration with shipping rate calculators",
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
          notifyToast("info", "You've been added to the early access list for Orders!")
        }
        className="cursor-pointer"
      >
        Join Beta Waitlist
      </Button>
    </EmptyPage>
  );
}
