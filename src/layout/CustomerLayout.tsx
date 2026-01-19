import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import { useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";

const CustomerLayout = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
