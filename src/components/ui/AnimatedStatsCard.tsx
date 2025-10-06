import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface AnimatedStatsCardProps {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const AnimatedStatsCard: React.FC<AnimatedStatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const increment = value / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-700 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-8 opacity-0 scale-95'
      }`}
      style={themeStyles.card}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
            <div className={`${color} text-xl`}>
              {icon}
            </div>
          </div>
          <div className={`text-sm font-medium ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? '+' : '-'}{Math.abs(change)}%
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </h3>
          <div className="text-3xl font-bold" style={themeStyles.text}>
            {formatNumber(animatedValue)}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                isVisible ? 'w-full' : 'w-0'
              } ${color}`}
              style={{
                transitionDelay: `${delay + 500}ms`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStatsCard;
