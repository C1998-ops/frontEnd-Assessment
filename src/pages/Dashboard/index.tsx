import React from "react";
import { useTheme } from "../../hooks/useTheme";

const Dashboard: React.FC = () => {
  const { getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();
  
  return (
    <div className="p-6" style={themeStyles.container}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={themeStyles.text}>
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-secondary">
            Welcome to your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg shadow-lg p-6 border" style={themeStyles.card}>
            <h3 className="text-lg font-semibold" style={themeStyles.text}>
              Total Users
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,234</p>
          </div>

          <div className="rounded-lg shadow-lg p-6 border" style={themeStyles.card}>
            <h3 className="text-lg font-semibold" style={themeStyles.text}>
              Active Sessions
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">567</p>
          </div>

          <div className="rounded-lg shadow-lg p-6 border" style={themeStyles.card}>
            <h3 className="text-lg font-semibold" style={themeStyles.text}>
              Pending Tasks
            </h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">89</p>
          </div>

          <div className="rounded-lg shadow-lg p-6 border" style={themeStyles.card}>
            <h3 className="text-lg font-semibold" style={themeStyles.text}>
              Completed
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">432</p>
          </div>
        </div>

        <div className="rounded-lg shadow-lg p-6 border" style={themeStyles.card}>
          <h3 className="text-lg font-semibold mb-4" style={themeStyles.text}>
            Recent Activity
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Activity feed will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
