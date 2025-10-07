import React, { useEffect, useRef, useState } from "react";
import type { SidebarItem, SidebarProps } from "../../constants/types";
import { FaCogs, FaHome, FaUsers, FaBars } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import Button from "../ui/Button";
import type { RootState } from "../../store/store";

const sidebarMenuItems: SidebarItem[] = [
  {
    id: "1",
    label: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
  },
  {
    id: "2",
    label: "Users",
    path: "/dashboard/users",
    icon: <FaUsers />,
  },
  {
    id: "3",
    label: "Settings",
    path: "/dashboard/settings",
    icon: <FaCogs />,
  },
];
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPositions, setTooltipPositions] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Use user for username and userdata fields, center aligned
  const username = user?.username || "Unknown User";
  const userdata = user?.email || "No email";

  const isProvider = false;
  const hasPractices = false;
  const userProfile = { profilePictureUrl: null };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <React.Fragment>
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
          aria-hidden="true"
          role="presentation"
        />
      )}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-[85px] h-[calc(100vh-85px)] z-[40] bg-blue-900 shadow-lg flex flex-col w-64 md:w-72 rounded-r-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Hamburger Menu Button - Only visible when sidebar is closed */}
        {!isOpen && isMobile && (
          <div className="absolute top-4 right-2 z-40">
            <button
              onClick={onOpen}
              className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 text-white transition-colors duration-200"
              aria-label="Open sidebar"
            >
              <FaBars size={16} />
            </button>
          </div>
        )}

        {/* Main Content Container - Flexbox Layout */}
        <div className="flex flex-col h-full w-full">
          {isOpen && (
            <>
              {/* User Info Section - Fixed at top */}
              <div className="flex-shrink-0 px-4 py-4 border-b border-purple-500/30">
                {!isProvider || !hasPractices ? (
                  <div className="flex items-center gap-3">
                    {userProfile?.profilePictureUrl ? (
                      <img
                        src={userProfile?.profilePictureUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : null}
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-sm font-medium truncate capitalize">
                        {username}
                      </span>
                      <span
                        className="text-yellow-400 text-xs truncate"
                        title={userdata}
                      >
                        {userdata}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Navigation Menu - Flexible middle section */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <nav className="space-y-2">
                  <ul className="space-y-2">
                    {sidebarMenuItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      const tooltipLabel = item.tooltip || item.label;
                      const activeStyles = {
                        borderRadius: "24px",
                        border: isActive
                          ? "1px solid #6374EA"
                          : "1px solid transparent",
                        background: isActive ? "#00276B" : "",
                        boxShadow: isActive ? "0 0 12px 0 #6374EA" : "",
                        color: isActive ? "white" : "",
                      };

                      return (
                        <li key={item.path} className="relative">
                          {isActive && (
                            <div
                              className="absolute left-0 top-0 h-full w-full bg-blue-800 text-white border-none rounded-full shadow-[12px_4px_12px_4px_rgba(99,116,234,0.3)] hover:shadow-[0_8px_16px_8px_rgba(99,116,234,0.4)] transition-shadow duration-300"
                            />
                          )}
                          <div className="relative group">
                            <Link
                              id={`menu-item-${item.path}`}
                              to={item.path}
                              className="flex items-center py-3 px-4 text-purple-200 hover:bg-white/10 hover:text-white rounded-full transition-all duration-300 ease-in-out"
                              onMouseEnter={(event) => {
                                if (!isActive && !isMobile) {
                                  const positions =
                                    event.currentTarget.getBoundingClientRect();
                                  setTooltipPositions(positions);
                                  setHoveredItem(tooltipLabel);
                                }
                              }}
                              onMouseLeave={() => setHoveredItem(null)}
                              style={activeStyles}
                            >
                              <span className="flex items-center justify-center w-6 h-6">
                                {item.icon}
                              </span>
                              <span
                                className={`ml-3 truncate transition-all duration-300 font-normal ${
                                  isActive ? "text-white font-medium" : ""
                                }`}
                                title={item.label}
                              >
                                {item.label}
                              </span>
                            </Link>
                            {!isOpen &&
                              !isMobile &&
                              hoveredItem === tooltipLabel && (
                                <div
                                  className="fixed z-50 px-2 py-1 text-xs font-normal text-white bg-gray-500 rounded-md shadow-lg pointer-events-none"
                                  style={{
                                    whiteSpace: "nowrap",
                                    top: tooltipPositions?.y,
                                    left: tooltipPositions?.x,
                                    transform: "translateY(-50%)",
                                  }}
                                >
                                  {hoveredItem}
                                </div>
                              )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              {/* Logout Section - Fixed at bottom */}
              <div className="flex-shrink-0 px-4 py-4 border-t border-purple-500/30">
                <div className="flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full rounded-lg bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/50 transition-all duration-200 py-2"
                    onClick={handleLogout}
                  >
                    <TbLogout2 className="w-4 h-4 mr-2" />
                    LOG OUT
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Collapsed State - Only show logout icon */}
          {!isOpen && (
            <div className="flex flex-col h-full justify-between items-center py-4">
              {/* Navigation Icons */}
              <div className="flex flex-col space-y-4">
                {sidebarMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-blue-800 text-white"
                          : "text-purple-200 hover:bg-white/10 hover:text-white"
                      }`}
                      title={item.label}
                    >
                      {item.icon}
                    </Link>
                  );
                })}
              </div>

              {/* Logout Icon at Bottom */}
              <div className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-full text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                  title="Log Out"
                >
                  <TbLogout2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
