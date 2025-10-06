import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface Activity {
  id: string;
  type: 'user' | 'system' | 'notification' | 'update';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  maxItems?: number;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  maxItems = 5
}) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animation for each item
          activities.slice(0, maxItems).forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, index]);
            }, index * 150);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [activities, maxItems]);

  const getActivityIcon = (type: string) => {
    const iconClasses = "w-5 h-5";
    switch (type) {
      case 'user':
        return <div className={`${iconClasses} rounded-full bg-blue-500 flex items-center justify-center text-white text-xs`}>U</div>;
      case 'system':
        return <div className={`${iconClasses} rounded-full bg-green-500 flex items-center justify-center text-white text-xs`}>S</div>;
      case 'notification':
        return <div className={`${iconClasses} rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs`}>N</div>;
      case 'update':
        return <div className={`${iconClasses} rounded-full bg-purple-500 flex items-center justify-center text-white text-xs`}>U</div>;
      default:
        return <div className={`${iconClasses} rounded-full bg-gray-500 flex items-center justify-center text-white text-xs`}>?</div>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div ref={containerRef} style={themeStyles.card} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={themeStyles.text}>
          Recent Activities
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.slice(0, maxItems).map((activity, index) => (
          <div
            key={activity.id}
            className={`transform transition-all duration-500 ease-out ${
              visibleItems.includes(index)
                ? 'translate-x-0 opacity-100'
                : 'translate-x-8 opacity-0'
            }`}
            style={{
              transitionDelay: `${index * 150}ms`
            }}
          >
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              {/* Activity Icon */}
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              
              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium" style={themeStyles.text}>
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
              </div>
              
              {/* Status Indicator */}
              <div className={`w-2 h-2 rounded-full ${activity.color} flex-shrink-0`} />
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-600 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
