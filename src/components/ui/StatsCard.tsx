import { MdArrowRight, MdOutlineAccessTime } from "react-icons/md";
import React from "react";
interface StatCardProps {
  title: string;
  total: number;
  subValues?: {
    active?: {
      label: string;
      count: number;
    };
    inactive?: {
      label: string;
      count: number;
    };
    in?: {
      label: string;
      count: number;
    };
    out?: {
      label: string;
      count: number;
    };
    processing?: {
      label: string;
      count: number;
    };
    ordered?: {
      label: string;
      count: number;
    };
  };
  change: string;
  time: string;
  changeColor?: string;
  borderColor?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  total,
  subValues,
  change,
  time,
  changeColor,
  borderColor,
  bgColor,
  icon,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex items-center">
          <span className="subheading-3 font-semibold text-primary-navy">
            {title}
          </span>
          <div className="text-primary-navy">
            <MdArrowRight size={25} />
          </div>
        </div>

        <div className="flex space-x-2">
          <span className="cursor-pointer text-primary-navy font-extrabold">
            &lt;
          </span>
          <span className="cursor-pointer text-primary-navy font-extrabold">
            &gt;
          </span>
        </div>
      </div>
      <div className="text-sm text-secondary-purple-300 px-4">
        {new Date().toLocaleString("default", { month: "long" })}
      </div>
      <div className="flex items-center justify-between gap-4 mt-2 px-4">
        <span className="text-[77px] font-thin text-primary-navy">{total}</span>
        {subValues?.active !== undefined &&
          subValues?.inactive !== undefined && (
            <div className="flex gap-4 text-secondary-purple-300">
              <div className="flex flex-col gap-2">
                <p className="text-sm">{subValues.active.label}</p>
                <p className=" heading-3 font-light tracking-wider text-center">
                  {subValues.active.count}
                </p>
              </div>
              <div className="w-[1px] h-16 bg-secondary-purple-200"></div>
              <div className="flex flex-col gap-2">
                <p className="text-sm">{subValues.inactive.label}</p>
                <p className="heading-3 font-light tracking-wider text-center">
                  {subValues.inactive.count}
                </p>
              </div>
            </div>
          )}
        {subValues?.in !== undefined && subValues?.out !== undefined && (
          <div className="flex gap-4 text-secondary-purple-300">
            <div className="flex flex-col gap-2">
              <p className="text-sm">{subValues.in.label}</p>
              <p className="heading-3 font-light tracking-wider text-center">
                {subValues.in.count}
              </p>
            </div>
            <div className="w-[1px] h-16 bg-secondary-purple-200"></div>
            <div className="flex flex-col gap-2">
              <p className="text-sm">{subValues.out.label}</p>
              <p className="heading-3 font-light tracking-wider text-center">
                {subValues.out.count}
              </p>
            </div>
          </div>
        )}
        {subValues?.processing !== undefined &&
          subValues?.ordered !== undefined && (
            <div className="flex gap-4 text-secondary-purple-300">
              <div className="flex flex-col gap-2">
                <p className="text-sm">{subValues.processing.label}</p>
                <p className="heading-3 font-light tracking-wider text-center">
                  {subValues.processing.count}
                </p>
              </div>
              <div className="w-[1px] h-16 bg-secondary-purple-200"></div>
              <div className="flex flex-col gap-2">
                <p className="text-sm">{subValues.ordered.label}</p>
                <p className="heading-3 font-light tracking-wider text-center">
                  {subValues.ordered.count}
                </p>
              </div>
            </div>
          )}
      </div>
      <div
        className={`border-2 ${borderColor} ${bgColor} pt-2 mt-3 rounded-b-lg`}
      >
        <div className="flex justify-between items-center text-sm px-4 pb-2">
          <span className={`${changeColor} flex items-center gap-1`}>
            {icon}
            {change}
          </span>
          <span className="text-primary-navy flex items-center gap-1">
            <MdOutlineAccessTime size={15} />
            CM: {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
