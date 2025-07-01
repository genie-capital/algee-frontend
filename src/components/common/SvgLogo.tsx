// @ts-expect-error: vite-plugin-svgr import
import LogoSVG from "@/assets/Genie -Capital-logo-square.svg?react";
import React from "react";

interface SvgLogoProps {
  size?: 'small' | 'medium';
  title?: string;
}

const SvgLogo: React.FC<SvgLogoProps> = ({ size = 'medium', title }) => {
  const isSmall = size === 'small';
  const containerClass = isSmall ? "flex items-center space-x-2" : "flex flex-col items-center";
  const svgClass = isSmall ? "w-[120px] h-[48px]" : "w-[200px] h-[80px]";
  const titleClass = isSmall 
    ? "text-md font-semibold text-[#07002F]" 
    : "mt-2 text-sm font-medium text-[#07002F]";

  return (
    <div className={containerClass}>
      <LogoSVG className={svgClass} />
      {title && <div className={titleClass}>{title}</div>}
    </div>
  );
};

export default SvgLogo; 