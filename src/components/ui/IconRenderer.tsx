import React, { useEffect, useState } from "react";

export type IconType =
  | React.ComponentType<{ className?: string; [key: string]: any }>
  | React.ReactElement
  | string
  | null
  | undefined;

interface IconRendererProps {
  icon: IconType;
  className?: string;
  size?: number;
  onClick?: () => void;
  title?: string;
  "aria-label"?: string;
  color?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  className = "",
  size = 18,
  onClick,
  title,
  "aria-label": ariaLabel,
  color = "",
}) => {
  const [iconColor, setIconColor] = useState(color);
  useEffect(() => {
    setIconColor(color);
  }, [color]);

  if (!icon) {
    return null;
  }

  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, {
      className: `${className.trim()}`,
      ...(icon.props as any),
      onClick,
      title,
      "aria-label": ariaLabel,
      style: {
        width: size,
        height: size,
        objectFit: "contain" as const,
        color: iconColor,
        ...(icon.props as any).style,
      },
    });
  }

  // Handle React components (functions)
  if (typeof icon === "function") {
    try {
      return React.createElement(icon, {
        className: `${className.trim()}`,
        onClick,
        title,
        "aria-label": ariaLabel,
        style: { width: size, height: size, color: iconColor },
      });
    } catch (error) {
      console.warn("Failed to render icon component:", error);
      return null;
    }
  }

  // Handle string URLs
  if (typeof icon === "string") {
    if (icon.trim()) {
      return (
        <img
          src={icon}
          alt={ariaLabel || "icon"}
          style={{
            width: size,
            height: size,
            objectFit: "contain" as const,
            color: iconColor,
          }}
          className={className.trim()}
          onClick={onClick}
          title={title}
          onError={(e) => {
            console.warn("Failed to load icon image:", icon);
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }
    return null;
  }

  // Fallback for unexpected types
  console.warn("Unsupported icon type:", typeof icon, icon);
  return null;
};
export default IconRenderer;
