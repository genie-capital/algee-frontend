// @ts-expect-error: vite-plugin-svgr import
import LogoSVG from "@/assets/Genie -Capital-logo-square.svg?react";
import React from "react";

interface LogoProps {
  size?: 'small' | 'medium';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const isSmall = size === 'small';
  const containerClass = isSmall ? "flex flex-col items-center space-y-2" : "flex flex-col items-center";
  const svgClass = isSmall ? "w-[120px] h-[48px]" : "w-[200px] h-[80px]";
  const gradientClass = isSmall ? "w-[120px] h-[48px]" : "w-[200px] h-[80px]";
  const textClass = isSmall ? "text-xl" : "text-2xl";
  const headingClass = isSmall? "text-m" : "text-lg";
  const subtitleClass = isSmall ? "text-xs" : "text-sm";

  return (
    <div className={containerClass}>
      <LogoSVG className={svgClass} />
      <div className={`${gradientClass} bg-gradient-to-r from-[#008400e2] to-[#07002fe7] flex items-center justify-center rounded-md`}>
        <span className={`${textClass} font-bold text-white`}>ALGEE</span>
      </div>
      <div className={`mt-2 ${headingClass} font-medium text-[#07002F]`}>
        Africa's Premium Credit Intelligence
      </div>
    </div>
  );
};

export default Logo;