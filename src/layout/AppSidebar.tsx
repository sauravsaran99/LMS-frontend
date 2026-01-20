import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  BoxIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
// import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles: Array<"SUPER_ADMIN" | "BRANCH_ADMIN" | "RECEPTIONIST" | "TECHNICIAN" | "CUSTOMER">;
  subItems?: {
    name: string;
    path: string;
    roles?: Array<"SUPER_ADMIN" | "BRANCH_ADMIN" | "RECEPTIONIST" | "TECHNICIAN" | "CUSTOMER">;
    pro?: boolean;
    new?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
    roles: ["SUPER_ADMIN", "BRANCH_ADMIN"],
  },
  {
    icon: <BoxIcon />,
    name: "Customer",
    roles: ["CUSTOMER"],
    subItems: [
      {
        name: "My Bookings",
        path: "/customer/bookings",
        roles: ["CUSTOMER"],
      },
      // { name: "My Bookings", path: "/bookings/:id", roles: ["CUSTOMER"] },
      { name: "Payments", path: "/customer/payments", roles: ["CUSTOMER"] },
      { name: "Reports", path: "/customer/reports", roles: ["CUSTOMER"] },
    ],
  },
  {
    icon: <BoxIcon />,
    name: "Admin",
    roles: ["SUPER_ADMIN"],
    subItems: [
      {
        name: "Branches",
        path: "/admin/branches",
        roles: ["SUPER_ADMIN"],
      },
      { name: "Test Master", path: "/admin/tests", roles: ["SUPER_ADMIN"] },
      { name: "Doctor Master", path: "/admin/doctors", roles: ["SUPER_ADMIN"] },
      { name: "Branch Admins", path: "/admin/branch-admins", roles: ["SUPER_ADMIN"] },
      { name: "Audit Logs", path: "/admin/audit-logs", roles: ["SUPER_ADMIN"] },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Branch Admin",
    roles: ["BRANCH_ADMIN"],
    subItems: [{ name: "Users", path: "/branch-admin/users" }],
  },
  {
    icon: <CalenderIcon />,
    name: "Bookings",
    path: "/bookings",
    roles: ["RECEPTIONIST"],
  },
  {
    icon: <UserCircleIcon />,
    name: "Customers",
    path: "/customers",
    roles: ["RECEPTIONIST"],
  },
  {
    icon: <TableIcon />,
    name: "Technician Assignment",
    path: "/bookings/assign-technician",
    roles: ["RECEPTIONIST"],
  },
  {
    name: "Technician",
    roles: ["TECHNICIAN"],
    icon: <BoxIcon />,
    subItems: [
      {
        name: "Assigned Bookings",
        path: "/technician/bookings",
        roles: ["TECHNICIAN"],
      },
      {
        name: "Completed Bookings",
        path: "/technician/bookings/completed",
        roles: ["TECHNICIAN"],
      },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Payments",
    path: "/payments",
    roles: ["RECEPTIONIST", "TECHNICIAN"],
  },
  {
    icon: <ListIcon />,
    name: "Reports",
    // path: "/reports",
    roles: ["SUPER_ADMIN", "BRANCH_ADMIN"],
    subItems: [
      {
        name: "Summary Report",
        path: "/reports/summary",
        // roles: ["TECHNICIAN"],
      },
      {
        name: "Branch Monthly Breakdown",
        path: "/reports/monthly-breakdown",
        // roles: ["TECHNICIAN"],
      },
      {
        name: "Technician Monthly Report",
        path: "/reports/technician-monthly-breakdown",
        // roles: ["TECHNICIAN"],
      },
      {
        name: "Test Monthly Report",
        path: "/reports/test-monthly-breakdown",
        // roles: ["TECHNICIAN"],
      },
    ],
  },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },
  // {
  //   icon: <PlugInIcon />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const allowedNavItems = navItems.filter((item) => user && item.roles.includes(user?.role));

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
      >
        <Link to="/" className="flex items-center gap-2">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700">
                <span className="text-white font-bold text-lg">Rx</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  LMS
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                  Pathology Lab
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700">
              <span className="text-white font-bold text-lg">Rx</span>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(allowedNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
