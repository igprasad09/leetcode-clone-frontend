import React from "react";

interface TooltipButtonProps {
  onclick: () => void;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({onclick}) => {
  return (
    <div onClick={onclick} className="relative group ml-45 cursor-pointer w-[120px] h-[35px] grid place-items-center rounded-lg border-2 border-gray-200 font-semibold text-[14px] uppercase overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-lg hover:text-white hover:border-transparent">
      
      {/* Tooltip */}
      <span className="absolute -top-20 left-1/2 -translate-x-1/2 scale-0 opacity-0 pointer-events-none 
      bg-[#333] text-white text-[16px] font-normal capitalize px-3 py-1 rounded-lg shadow-lg
      transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
      group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto
      group-hover:animate-[shake_0.5s_ease-in-out]">

        Uiverse.io

        {/* Arrow */}
        <span className="absolute w-3 h-3 bg-[#333] rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></span>
      </span>

      {/* Main Text */}
      <span className="absolute inset-0 grid place-items-center transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-0 group-hover:left-full">
        Rank 👑
      </span>

      {/* Hover Background Text */}
      <span className="absolute inset-0 grid place-items-center bg-[#333] text-white rounded-lg scale-0 left-full 
      transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
      group-hover:scale-100 group-hover:left-0">
        Home! 👋
      </span>
    </div>
  );
};

export default TooltipButton;
