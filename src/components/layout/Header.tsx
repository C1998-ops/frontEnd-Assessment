import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaSun, FaMoon } from "react-icons/fa";
import Breadcrumb from "../ui/Breadcrumb";
import type { TopNavItems } from "../../constants/types";
import { toggleTheme } from "../../store/slices/themeSlice";
import type { RootState } from "../../store/store";
import { useTheme } from "../../hooks/useTheme";

const basicBreadcrumbs: Record<
  string,
  Array<{ label: string; href?: string }>
> = {
  dashboard: [{ label: "Dashboard" }],
  users: [{ label: "Dashboard", href: "/dashboard" }, { label: "Users" }],
  settings: [{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }],
  logout: [{ label: "Dashboard", href: "/dashboard" }, { label: "Logout" }],
};

interface TopNavProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isPaidUser: boolean;
}

// local minimal typing; global RootState not required here
const basicMenuItems: TopNavItems[] = [
  {
    id: "1",
    path: "/dashboard",
    label: "Dashboard",
  },
  {
    id: "2",
    path: "/dashboard/users",
    label: "Users",
  },
  {
    id: "3",
    path: "/dashboard/settings",
    label: "Settings",
  },
  {
    id: "4",
    path: "/dashboard/logout",
    label: "Logout",
  },
];

const TopNav: React.FC<TopNavProps> = ({
  isSidebarOpen: _isSidebarOpen,
  toggleSidebar,
  isPaidUser: _isPaidUser = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useSelector((state: RootState) => state.theme);
  const { getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();
  const getPathForBreadcrumb = () => {
    const path = location.pathname;
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    if (basicBreadcrumbs[cleanPath]) {
      return cleanPath;
    }

    const firstPart = cleanPath.split("/")[0];
    return firstPart || "dashboard";
  };

  const currentPath = getPathForBreadcrumb();

  const isTopNavItemActive = (itemPath: string) => {
    const normalizedCurrent = location.pathname.replace(/\/+$/, "");
    const normalizedItem = itemPath.replace(/\/+$/, "");

    // Dashboard only active on the dashboard index route
    if (normalizedItem === "/dashboard") {
      return normalizedCurrent === "/dashboard";
    }

    // For nested items like /dashboard/users, mark active when current path starts with the item path
    return normalizedCurrent.startsWith(normalizedItem);
  };

  return (
    <div
      className={`sticky top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 ${themeStyles.container.backgroundColor}`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/4 left-24 text-primary-navy p-2 rounded-md hover:bg-gray-100 ${themeStyles.primary.color}`}
          aria-label="Toggle sidebar"
        >
          <FaBars size={18} />
        </button>
        <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left: Breadcrumb + Nav */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {/* Global hamburger to toggle sidebar */}
              <Breadcrumb
                items={
                  basicBreadcrumbs[currentPath] || basicBreadcrumbs.dashboard
                }
                className={`mr-3 ${themeStyles.text.color}`}
              />
            </div>
            <div className="mt-2 md:mt-3">
              <nav className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                {basicMenuItems.map((item) => {
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`hover:text-primary border-b-2 border-secondary whitespace-nowrap text-xs lg:text-base pb-1 px-1 sm:px-2 ${
                        themeStyles.primary.color
                      } ${
                        isTopNavItemActive(item.path)
                          ? `border-opacity-50 ${themeStyles.primary.color} font-semibold`
                          : `border-opacity-35 text-gray-500`
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${themeStyles.primary.color}`}
              aria-label="Toggle theme"
            >
              {currentTheme === "light" ? (
                <FaSun className="text-yellow-500" size={18} />
              ) : (
                <FaMoon
                  className={`text-gray-500 ${themeStyles.text.color}`}
                  size={18}
                />
              )}
            </button>
            <button className="p-1 flex items-center justify-center relative">
              <FaUserCircle
                size={22}
                className={`text-blue-600 ${themeStyles.text.color}`}
              />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] leading-none flex items-center justify-center rounded-full w-4 h-4 font-bold">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
