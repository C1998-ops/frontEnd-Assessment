import React, { useEffect, useRef, useState } from "react";
import type { SidebarItem, SidebarProps } from "../../constants/types";
import { FaCogs, FaHome, FaUsers, FaBars } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
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
        className={`fixed left-0 top-[85px] h-[calc(100vh-85px)] z-[40] bg-blue-900 shadow-lg flex flex-col items-center w-64 md:w-72 rounded-r-xl ${
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

        {/* Content Wrapper */}
        <div className="flex flex-col h-full w-full md:max-w-screen-sm mx-auto">
          <div
            className={`flex px-2 py-4 relative w-full ${
              isOpen && isMobile ? "mt-16 py-2" : ""
            }`}
          >
            <div className="px-2 py-1 flex justify-end items-center border-b border-white/10 absolute top-0 right-0"></div>
            {isOpen && (
              <div className="flex flex-col py-2 mt-1 border-b border-t border-purple-500 w-full sm:max-w-full">
                {/* User info */}
                {!isProvider || !hasPractices ? (
                  <div className="flex items-center justify-start p-2 md:px-4 gap-2">
                    {userProfile?.profilePictureUrl ? (
                      <img
                        src={userProfile?.profilePictureUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : null}
                    <div className="flex flex-col max-w-[160px]">
                      <span className="text-white text-sm font-medium truncate leading-tight capitalize">
                        {username}
                      </span>
                      <span
                        className="text-yellow-400 text-xs truncate leading-tight"
                        title={userdata}
                      >
                        {userdata}
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* Scrollable Menu Section */}
                <div className="flex-1 overflow-y-auto w-full">
                  <nav className="flex-1 p-4 text-primary-medium max-h-full sm:max-h-[calc(100vh-150px)]">
                    <ul className="gap-2 space-y-2 md:space-y-4 w-full flex flex-col justify-start">
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
                          <li key={item.path} className="relative w-full">
                            {isActive && (isOpen || !isMobile) && (
                              <div
                                className="absolute left-0 top-0 h-full w-full bg-blue-800 text-white border-none rounded-full shadow-[12px_4px_12px_4px_rgba(99,116,234,0.3)] hover:shadow-[0_8px_16px_8px_rgba(99,116,234,0.4)] transition-shadow duration-300 md:shadow-[0_6px_14px_6px_rgba(99,116,234,0.35)]"
                                style={{
                                  transform: `${
                                    isOpen ? "scaleX(1)" : "translateX(-160px)"
                                  }`,
                                  transformOrigin: "center",
                                }}
                              />
                            )}
                            <div className="relative w-full group">
                              <Link
                                id={`menu-item-${item.path}`}
                                to={item.path}
                                className={`flex items-center py-2 ${
                                  isOpen ? "px-4" : "px-2"
                                } text-purple-200 hover:bg-white/10 hover:text-white rounded-full transition-all duration-300 ease-in-out ${
                                  !isOpen ? "justify-center" : ""
                                }`}
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
                                {isOpen && (
                                  <span
                                    className={`ml-2 truncate transition-all duration-300 text-primary-medium font-normal ${
                                      isActive ? "text-white font-medium" : ""
                                    }`}
                                    title={item.label}
                                  >
                                    {item.label}
                                  </span>
                                )}
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

                {/* Bottom Section */}
                <div className="mt-auto flex flex-col gap-y-1 items-center justify-end w-full pt-2 border-purple-300/30">
                  {isOpen && (
                    <div className="flex md:px-4 border-t border-purple-300/30 w-full max-w-[calc(100%-40px)] h-6"></div>
                  )}
                  <div className="w-full flex flex-col">
                    <div className="flex w-full max-w-[180px] mx-auto items-center justify-evenly gap-2 py-2 flex-col">
                      {/* Arrow Button */}
                      {!isOpen && (
                        <div className="absolute -right-3 bottom-28 w-full md:w-auto min-h-[40px] flex items-center justify-center">
                          <IoIosArrowForward
                            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-300 bg-yellow-400 text-white rounded-full"
                            onClick={onOpen}
                          />
                        </div>
                      )}
                      {/* Logout Button */}
                      {!isOpen ? (
                        <div className="block w-auto mx-auto px-2 py-2 cursor-pointer">
                          <TbLogout2
                            className="w-5 h-5 text-yellow-400 font-bold"
                            onClick={handleLogout}
                            title="Log Out"
                          />
                        </div>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-auto mx-auto rounded-sm bg-transparent hover:bg-gray-200 text-yellow-400 text-xs py-1"
                          onClick={handleLogout}
                        >
                          LOG OUT
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
