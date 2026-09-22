import { Link } from "react-router-dom";
import logo from "@/assets/icons/favicon.svg";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { useSidebar } from "@/components/ui/sidebar";

export default function SidebarTitle() {
  const { setOpenMobile } = useSidebar();

  return (
    <div className="flex h-16 items-center justify-between gap-2 px-2 pb-2 pt-7 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:items-center">
      <Link
        to="/products"
        onClick={() => setOpenMobile(false)}
        className="flex items-center gap-2 transition-none group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center"
      >
        <img
          src={logo}
          alt="Interloid"
          loading="lazy"
          className="h-15 w-auto shrink-0 object-contain group-data-[collapsible=icon]:size-8"
        />
        <div className="flex flex-col pt-1 uppercase tracking-widest">
          <span className="font-extrabold text-xs group-data-[collapsible=icon]:hidden">
            Product
          </span>
          <span className="font-medium text-base/2.5 text-[12px] group-data-[collapsible=icon]:hidden">
            Management
          </span>
          <span className="font-medium text-xs group-data-[collapsible=icon]:hidden">
            System
          </span>
        </div>
      </Link>
      <CustomSidebarTrigger className="shrink-0 transition-none group-data-[collapsible=icon]:ml-0" />
    </div>
  );
}
