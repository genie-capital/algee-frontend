import React from "react";

interface GradientLogoProps {
  size?: 'small' | 'medium';
  showSubtitle?: boolean;
}

const GradientLogo: React.FC<GradientLogoProps> = ({ size = 'medium', showSubtitle = true }) => {
  const isSmall = size === 'small';
  const containerClass = isSmall ? "flex flex-col items-center space-y-1" : "flex flex-col items-center";
  const gradientClass = isSmall ? "w-[120px] h-[48px]" : "w-[200px] h-[80px]";
  const textClass = isSmall ? "text-xl" : "text-2xl";
  const subtitleClass = isSmall ? "text-xs" : "text-sm";

  return (
    <div className={containerClass}>
      <div className={`${gradientClass} bg-gradient-to-r from-[#008400e2] to-[#07002fe7] flex items-center justify-center rounded-md`}>
        <span className={`${textClass} font-bold text-white`}>ALGEE</span>
      </div>
      {showSubtitle && (
        <div className={`mt-2 ${subtitleClass} font-medium text-[#07002F]`}>
          Africa's Premium Credit Intelligence
        </div>
      )}
    </div>
  );
};

export default GradientLogo; 