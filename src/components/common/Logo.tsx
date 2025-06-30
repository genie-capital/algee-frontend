// @ts-expect-error: vite-plugin-svgr '?react' import
import LogoSVG from "@/assets/Genie -Capital-logo-square.svg?react";
import React from "react";

interface LogoProps {
  title: string;
  size?: 'small' | 'medium';
}

const Logo: React.FC<LogoProps> = ({ title, size = 'medium' }) => {
  const isSmall = size === 'small';
  const containerClass = isSmall ? "flex items-center space-x-2" : "flex flex-col items-center";
  const svgClass = isSmall ? "w-[120px] h-[48px]" : "w-[200px] h-[80px]";
  const titleClass = isSmall 
    ? "text-md font-semibold text-[#07002F]" 
    : "mt-2 text-sm font-medium text-[#07002F]";

  return (
    <div className={containerClass}>
      <LogoSVG className={svgClass} />
      <div className={titleClass}>{title}</div>
    </div>
  );
};

export default Logo;