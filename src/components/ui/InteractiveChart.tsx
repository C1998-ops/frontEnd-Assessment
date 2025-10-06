import React, { useState, useRef } from "react";
import { useTheme } from "../../hooks/useTheme";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface InteractiveChartProps {
  data: ChartData[];
  type: "line" | "bar";
  height?: number;
  showTooltip?: boolean;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  type,
  height = 300,
  showTooltip = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const { getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue;
  const padding = 40;
  const chartWidth = 600;
  const chartHeight = height - padding * 2;

  const getPoint = (index: number, value: number) => {
    const x =
      (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y =
      chartHeight - ((value - minValue) / range) * chartHeight + padding;
    return { x, y };
  };

  const createPath = () => {
    if (data.length < 2) return "";

    const points = data.map((d, i) => getPoint(i, d.value));
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
      const cp1y = points[i - 1].y;
      const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
      const cp2y = points[i].y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
    }

    return path;
  };

  const createAreaPath = () => {
    const linePath = createPath();
    const lastPoint = getPoint(data.length - 1, data[data.length - 1].value);
    const firstPoint = getPoint(0, data[0].value);

    return `${linePath} L ${lastPoint.x} ${chartHeight + padding} L ${
      firstPoint.x
    } ${chartHeight + padding} Z`;
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;

    setTooltipPosition({ x: event.clientX, y: event.clientY });

    // Find closest data point
    const pointWidth = (chartWidth - padding * 2) / (data.length - 1);
    const index = Math.round((x - padding) / pointWidth);

    if (index >= 0 && index < data.length) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="relative" style={themeStyles.card}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4" style={themeStyles.text}>
          Analytics Overview
        </h3>

        <div className="relative">
          <svg
            ref={svgRef}
            width="100%"
            height={height}
            viewBox={`0 0 ${chartWidth} ${height}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="cursor-crosshair"
          >
            {/* Grid lines */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const value = minValue + range * ratio;
              const y = chartHeight - ratio * chartHeight + padding;
              return (
                <text
                  key={i}
                  x="10"
                  y={y}
                  className="text-xs fill-gray-500"
                  textAnchor="start"
                  alignmentBaseline="middle"
                >
                  {Math.round(value).toLocaleString()}
                </text>
              );
            })}

            {/* X-axis labels */}
            {data.map((d, i) => {
              const point = getPoint(i, d.value);
              return (
                <text
                  key={i}
                  x={point.x}
                  y={chartHeight + padding + 20}
                  className="text-xs fill-gray-500"
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              );
            })}

            {type === "line" ? (
              <>
                {/* Area under the curve */}
                <path
                  d={createAreaPath()}
                  fill="url(#gradient)"
                  opacity="0.3"
                />

                {/* Line */}
                <path
                  d={createPath()}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-blue-500"
                />

                {/* Data points */}
                {data.map((d, i) => {
                  const point = getPoint(i, d.value);
                  return (
                    <circle
                      key={i}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="currentColor"
                      className={`text-blue-500 transition-all duration-200 ${
                        hoveredIndex === i ? "r-6" : ""
                      }`}
                    />
                  );
                })}
              </>
            ) : (
              // Bar chart
              data.map((d, i) => {
                const point = getPoint(i, d.value);
                const barHeight = chartHeight - (point.y - padding);
                return (
                  <rect
                    key={i}
                    x={point.x - 15}
                    y={point.y}
                    width="30"
                    height={barHeight}
                    fill={d.color}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                );
              })
            )}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.1"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Tooltip */}
          {showTooltip && hoveredIndex !== null && (
            <div
              className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none z-10"
              style={{
                left: tooltipPosition.x - 60,
                top: tooltipPosition.y - 60,
              }}
            >
              <div className="font-semibold">{data[hoveredIndex].label}</div>
              <div className="text-blue-300">
                {data[hoveredIndex].value.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveChart;
