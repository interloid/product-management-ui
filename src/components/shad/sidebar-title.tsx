import { Link } from "react-router-dom";
import logo from "@/assets/icons/favicon.svg";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { useSidebar } from "@/components/ui/sidebar";

export default function SidebarTitle() {
  const { setOpenMobile } = useSidebar();

  return (
    <div className="w-full px-1.5 pt-3 pb-1 group-data-[collapsible=icon]:p-1.5">
      <div className="flex items-center justify-between gap-4 rounded-md border-none border-border/70 bg-card px-2 py-2.5  transition-all group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:gap-2">
        <Link
          to="/products"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-2 min-w-0 transition-none group-data-[collapsible=icon]:justify-center"
        >
          <img
            src={logo}
            alt="PMS Logo"
            loading="lazy"
            className="h-11 sm:h-12 w-auto shrink-0 object-contain group-data-[collapsible=icon]:size-10"
          />
          <div className="flex flex-col pt-1 justify-center min-w-0 select-none group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold tracking-wider uppercase leading-none whitespace-nowrap">
              Product Management
            </span>
            <span className="text-xs font-extrabold tracking-wider uppercase leading-none pt-1">
              Systems
            </span>
          </div>
        </Link>
        <CustomSidebarTrigger className="shrink-0 group-data-[collapsible=icon]:size-7" />
      </div>
    </div>
  );
}
