import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

interface Rank {
  email: string;
  numberOfProgram: number;
}

// Helper component for the Medals
const MedalIcon = ({ rank }: { rank: number }) => {
  const colors = {
    1: "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]",
    2: "text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]",
    3: "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]",
  };
  
  return (
    <svg
      className={`w-6 h-6 absolute -top-4 -right-2 z-10 transition-transform duration-300 hover:scale-125 ${colors[rank as keyof typeof colors]}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 15.25c-2.35 0-4.25-1.9-4.25-4.25S9.65 6.75 12 6.75s4.25 1.9 4.25 4.25-1.9 4.25-4.25 4.25zm0-7c-1.52 0-2.75 1.23-2.75 2.75s1.23 2.75 2.75 2.75 2.75-1.23 2.75-2.75-1.23-2.75-2.75-2.75z" />
      <path d="M16 15.25v4.5c0 .41-.34.75-.75.75-.25 0-.48-.12-.62-.32l-2.63-3.75-2.63 3.75c-.14.2-.37.32-.62.32-.41 0-.75-.34-.75-.75v-4.5h1.5v3.1l1.88-2.68c.28-.4.86-.4 1.14 0l1.88 2.68v-3.1h1.5z" />
    </svg>
  );
};

function Leaderboard() {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://backend-nine-red-85.vercel.app/api/allrank")
      .then((res) => {
        setRanks(res.data.rank);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const top3 = ranks.slice(0, 3);
  const restOfRanks = ranks.slice(3);

  // Styling maps for the top 3 podiums
  const podiumStyles = {
    1: { height: "h-48", border: "border-yellow-500", nameColor: "text-yellow-500", delay: "0.4s", avatarDelay: "0.6s", glow: "hover:shadow-[0_-10px_30px_rgba(234,179,8,0.15)]" },
    2: { height: "h-40", border: "border-slate-400", nameColor: "text-slate-300", delay: "0.2s", avatarDelay: "0.4s", glow: "hover:shadow-[0_-10px_30px_rgba(148,163,184,0.1)]" },
    3: { height: "h-36", border: "border-amber-600", nameColor: "text-amber-500", delay: "0.6s", avatarDelay: "0.8s", glow: "hover:shadow-[0_-10px_30px_rgba(217,119,6,0.1)]" },
  };

  const renderPodiumCard = (user: Rank | undefined, rank: 1 | 2 | 3) => {
    if (!user) return <div className={`w-28 sm:w-36 ${podiumStyles[rank].height}`} />; // Placeholder

    return (
      <div className="flex flex-col items-center justify-end group">
        {/* Avatar & Medal */}
        <div className="relative mb-3 animate-pop-in opacity-0" style={{ animationDelay: podiumStyles[rank].avatarDelay }}>
          <MedalIcon rank={rank} />
          <img
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 ${podiumStyles[rank].border} bg-zinc-800 object-cover p-1 transition-transform duration-300 group-hover:scale-110`}
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
            alt="avatar"
          />
        </div>

        {/* Podium Base */}
        <div
          className={`w-28 sm:w-36 ${podiumStyles[rank].height} bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-t-xl border-t border-x border-zinc-700/50 flex flex-col items-center pt-4 px-2 shadow-xl transition-all duration-300 group-hover:-translate-y-2 ${podiumStyles[rank].glow} animate-slide-up-podium opacity-0`}
          style={{ animationDelay: podiumStyles[rank].delay }}
        >
          <span className={`font-bold text-sm sm:text-base truncate w-full text-center ${podiumStyles[rank].nameColor}`}>
            {user.email.split("@")[0]}
          </span>
          <span className="text-zinc-400 text-xs sm:text-sm mt-1 font-medium">{user.numberOfProgram} Solved</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-zinc-700 flex flex-col overflow-hidden">
      <Navbar programdet={false} leaderboard={true} />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        
        {/* --- Header Section --- */}
        <div className="mb-10 text-center sm:text-left animate-fade-in">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Global Ranking</h1>
          <p className="text-sm text-zinc-500 mt-2">Top problem solvers across the platform.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex gap-4 items-end">
               <div className="w-28 h-40 bg-zinc-800/50 rounded-t-xl animate-pulse" style={{ animationDelay: '0ms' }}></div>
               <div className="w-28 h-48 bg-zinc-800/50 rounded-t-xl animate-pulse" style={{ animationDelay: '150ms' }}></div>
               <div className="w-28 h-36 bg-zinc-800/50 rounded-t-xl animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : ranks.length > 0 ? (
          <>
            {/* Top 3 Podium Section */}
            <div className="flex justify-center items-end gap-2 sm:gap-4 mt-8 mb-16">
              {renderPodiumCard(top3[1], 2)}
              {renderPodiumCard(top3[0], 1)}
              {renderPodiumCard(top3[2], 3)}
            </div>

            {/* Rest of the Leaderboard List */}
            <div className="flex flex-col gap-3 pb-10">
              {restOfRanks.map((user, index) => {
                const actualRank = index + 4; // Because we sliced off the first 3
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#151515] hover:bg-zinc-800/80 transition-all duration-300 border border-zinc-800 rounded-2xl p-4 sm:px-6 shadow-sm hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5 animate-slide-in-left opacity-0"
                    style={{ animationDelay: `${0.8 + (index * 0.1)}s` }}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className="text-zinc-500 font-bold text-lg w-6 text-center transition-colors group-hover:text-zinc-400">
                        {actualRank}
                      </span>
                      <img
                        className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700"
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                        alt="avatar"
                      />
                      <span className="font-semibold text-zinc-200">
                        {user.email.split("@")[0]}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-zinc-500 tracking-wider">
                        RATING
                      </span>
                      <span className="text-emerald-500 font-bold text-lg">
                        {user.numberOfProgram}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center text-zinc-500 py-20 animate-fade-in">
            No ranking data available yet.
          </div>
        )}
      </div>

      {/* ── Global Styles & Keyframes ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpPodium {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          70% { transform: scale(1.1) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-slide-up-podium {
          animation: slideUpPodium 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-pop-in {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default Leaderboard;