export default function HelpTooltip() {
  return (
    <div className="relative inline-block group ">
      
      {/* Button */}
      <button
        aria-describedby="help-tooltip"
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 
                   text-white font-semibold text-base
                   px-6 py-3 rounded-lg
                   shadow-md
                   transition-all duration-200
                   hover:-translate-y-1 hover:shadow-lg
                   focus:-translate-y-1 focus:shadow-lg"
      >
        Need Help?
      </button>

      {/* Tooltip */}
      <div
        role="tooltip"
        id="help-tooltip"
        className="absolute bottom-[calc(100%+15px)] left-1/2 
                   -translate-x-1/2 translate-y-2
                   px-5 py-3
                   bg-gradient-to-r from-white to-gray-50
                   text-gray-800 text-sm
                   border border-gray-200
                   rounded-xl shadow-xl
                   whitespace-nowrap
                   opacity-0 invisible
                   transition-all duration-300
                   group-hover:opacity-100 
                   group-hover:visible 
                   group-hover:translate-y-0"
      >
        <span className="mr-2 text-indigo-500">💡</span>
        <strong className="animate-pulse font-semibold">
          Get assistance
        </strong>{" "}
        with your questions!

        {/* Arrow */}
        <div
          className="absolute top-full left-1/2 
                     -translate-x-1/2 
                     w-0 h-0 
                     border-l-[8px] border-l-transparent
                     border-r-[8px] border-r-transparent
                     border-t-[8px] border-t-white"
        />
      </div>
    </div>
  );
}
