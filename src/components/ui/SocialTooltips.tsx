export default function SocialTooltips() {
  const socials = [
    {
      name: "Facebook",
      color: "text-blue-500",
      border: "border-blue-500",
      bg: "bg-blue-600",
      followers: "500+ Friends",
      initials: "FB",
    },
    {
      name: "LinkedIn",
      color: "text-sky-500",
      border: "border-sky-500",
      bg: "bg-sky-600",
      followers: "500+ Connections",
      initials: "IN",
    },
    {
      name: "Discord",
      color: "text-indigo-500",
      border: "border-indigo-500",
      bg: "bg-indigo-600",
      followers: "Community Member",
      initials: "DC",
    },
    {
      name: "Instagram",
      color: "text-pink-500",
      border: "border-pink-500",
      bg: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600",
      followers: "800+ Followers",
      initials: "IG",
    },
  ];

  return (
   <div className=" relative group cursor-pointer text-[17px]">
      
      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 opacity-0 pointer-events-none 
        group-hover:-top-40 group-hover:opacity-100 group-hover:pointer-events-auto
        transition-all duration-300 z-50">
        
        <div className="bg-[#2a2b2f] border border-[#52382f] rounded-[10px_15px] p-3
          shadow-[inset_5px_5px_5px_rgba(0,0,0,0.2),inset_-5px_-5px_15px_rgba(255,255,255,0.1),5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(255,255,255,0.1)]">
          
          <div className="flex gap-3 items-center">
            <div className="w-[50px] h-[50px] text-[25px] font-bold 
              border border-[#e6683c] rounded-lg flex items-center 
              justify-center bg-white">
              Ui
            </div>

            <div className="flex flex-col text-white">
              <div className="text-[17px] font-bold text-[#e6683c]">
                User
              </div>
              <div className="text-sm">@username</div>
            </div>
          </div>

          <div className="text-gray-400 pt-2 text-sm">
            800+ Followers
          </div>
        </div>
      </div>

      {/* Icon Section */}
      <a href="#" className="block relative">
        
        <div className="relative w-[55px] h-[55px] transition-transform duration-300 
          group-hover:-rotate-[35deg] group-hover:skew-x-[20deg]">
          
          {[1, 2, 3, 4, 5].map((_, i) => (
            <span
              key={i}
              className={`absolute top-0 left-0 w-full h-full 
              border border-[#e6683c] rounded-[15px] transition-all duration-300
              ${i === 0 ? "group-hover:opacity-20" : ""}
              ${i === 1 ? "group-hover:opacity-40 group-hover:translate-x-[5px] group-hover:-translate-y-[5px]" : ""}
              ${i === 2 ? "group-hover:opacity-60 group-hover:translate-x-[10px] group-hover:-translate-y-[10px]" : ""}
              ${i === 3 ? "group-hover:opacity-80 group-hover:translate-x-[15px] group-hover:-translate-y-[15px]" : ""}
              ${i === 4 ? "group-hover:opacity-100 group-hover:translate-x-[20px] group-hover:-translate-y-[20px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center" : ""}
              `}
            >
              {i === 4 && (
                <svg
                  fill="white"
                  viewBox="0 0 448 512"
                  className="w-6 h-6"
                >
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" />
                </svg>
              )}
            </span>
          ))}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 
          opacity-0 transition-all duration-300 
          group-hover:-bottom-8 group-hover:opacity-100 
          text-[#e6683c] font-medium">
          Instagram
        </div>
      </a>
    </div>
  );
}
