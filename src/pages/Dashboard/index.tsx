import React from "react";
import { useTheme } from "../../hooks/useTheme";
import AnimatedStatsCard from "../../components/ui/AnimatedStatsCard";
import InteractiveChart from "../../components/ui/InteractiveChart";
import RecentActivities from "../../components/ui/RecentActivities";
import ParallaxHero from "../../components/ui/ParallaxHero";
import { FaUsers, FaChartLine, FaTasks, FaCheckCircle } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const { getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  // Sample data for charts
  const chartData = [
    { label: "Jan", value: 4000, color: "#3B82F6" },
    { label: "Feb", value: 3000, color: "#3B82F6" },
    { label: "Mar", value: 5000, color: "#3B82F6" },
    { label: "Apr", value: 4500, color: "#3B82F6" },
    { label: "May", value: 6000, color: "#3B82F6" },
    { label: "Jun", value: 5500, color: "#3B82F6" },
    { label: "Jul", value: 7000, color: "#3B82F6" },
  ];

  // Sample activities data
  const activities = [
    {
      id: "1",
      type: "user" as const,
      title: "New user registered",
      description: "John Doe joined the platform",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      icon: <FaUsers />,
      color: "bg-green-500",
    },
    {
      id: "2",
      type: "system" as const,
      title: "System update completed",
      description: "Database optimization finished successfully",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      icon: <FaChartLine />,
      color: "bg-blue-500",
    },
    {
      id: "3",
      type: "notification" as const,
      title: "New notification sent",
      description: "Weekly report generated and sent to all users",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      icon: <FaTasks />,
      color: "bg-yellow-500",
    },
    {
      id: "4",
      type: "update" as const,
      title: "Feature update deployed",
      description: "New dashboard analytics feature is now live",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      icon: <FaCheckCircle />,
      color: "bg-purple-500",
    },
    {
      id: "5",
      type: "user" as const,
      title: "User profile updated",
      description: "Sarah Wilson updated her profile information",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      icon: <FaUsers />,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Parallax Hero Section */}
      <ParallaxHero
        title="Welcome to Your Dashboard"
        subtitle="Mind your business , updated with real-time analytics"
      />

      {/* Main Dashboard Content */}
      <div className="p-6 -mt-16 relative z-10" style={themeStyles.container}>
        <div className="space-y-8">
          {/* Animated Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedStatsCard
              title="Total Users"
              value={1234}
              change={12.5}
              changeType="increase"
              icon={<FaUsers />}
              color="text-blue-500"
              delay={0}
            />
            <AnimatedStatsCard
              title="Active Sessions"
              value={567}
              change={8.2}
              changeType="increase"
              icon={<FaChartLine />}
              color="text-green-500"
              delay={200}
            />
            <AnimatedStatsCard
              title="Pending Tasks"
              value={89}
              change={-5.3}
              changeType="decrease"
              icon={<FaTasks />}
              color="text-yellow-500"
              delay={400}
            />
            <AnimatedStatsCard
              title="Completed"
              value={432}
              change={15.7}
              changeType="increase"
              icon={<FaCheckCircle />}
              color="text-purple-500"
              delay={600}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              data={chartData}
              type="line"
              height={350}
              showTooltip={true}
            />
            <InteractiveChart
              data={chartData}
              type="bar"
              height={350}
              showTooltip={true}
            />
          </div>

          {/* Recent Activities */}
          <RecentActivities activities={activities} maxItems={5} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
