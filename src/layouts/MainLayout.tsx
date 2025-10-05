import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
      />

      {/* Main content area */}
      <div className={`transition-all duration-300`}>
        {/* Header */}
        <Header
          isMobile={isMobile}
          isSidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          isPaidUser={true}
        />

        {/* Page content */}
        <main
          className={`pt-24 pb-6 px-4 lg:px-8 transition-[padding] duration-300 ease-in-out ${
            sidebarOpen && !isMobile ? "lg:pl-64" : "lg:pl-24"
          }`}
        >
          <div
            className={`transition-transform duration-300 ease-in-out ${
              sidebarOpen && !isMobile ? "lg:translate-x-6 lg:translate-y-0" : "translate-x-0 translate-y-0"
            }`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
