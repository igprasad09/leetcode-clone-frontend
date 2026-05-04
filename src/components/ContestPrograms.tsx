import { profileEmailAtom } from "@/context";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { toast } from "sonner";
import { motion } from "framer-motion"; 
import Navbar from "./Navbar";

interface Program {
  _id: string;
  id: string;
  index?: string;
  title: string;
  solvedCount?: number;
}

interface LeaderboardEntry {
  userEmail: string;
  totalSolved: number;
  solvedPrograms: string[];
}

const ContestPrograms: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const profilEmail = useRecoilValue(profileEmailAtom);
  const [fetch, setFetch] = useState(true);

  // Fetch Programs
  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true);
      try {
        const res = await axios.post(
          "https://backend-nine-red-85.vercel.app/contests/contestprograms",
          { id }
        );
        // Assuming res.data.msg[0].addedPrograms is the correct path from your previous code
        setPrograms(res.data.msg[0]?.addedPrograms || []);
      } catch (err) {
        console.error("Programs fetch error:", err);
      }
      setLoading(false);
    }

    if (id) fetchPrograms();
  }, [id]);

  // Fetch Leaderboard
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await axios.post(
          "https://backend-nine-red-85.vercel.app/contests/contestsubmition",
          { id }
        );

        if (res.data.msg === "success") {
          const sorted = res.data.data.sort(
            (a: LeaderboardEntry, b: LeaderboardEntry) =>
              b.totalSolved - a.totalSolved
          );
          setLeaderboard(sorted);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    }

    if (id) fetchLeaderboard();
  }, [fetch, id]);

  const handle_join_contest = async () => {
    if (!profilEmail) {
      toast.error("Login again");
      return;
    }

    try {
      const res = await axios.post(
        "https://backend-nine-red-85.vercel.app/contests/joincontest",
        { profilEmail, id }
      );

      if (res.data.msg === "already joined") {
        toast.info("Already joined");
      } else {
        toast.success("Joined");
        setFetch((p) => !p);
      }
    } catch {
      toast.error("Error joining contest");
    }
  };

  const formatUsername = (email: string) => (email ? email.split("@")[0] : "Guest");

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Podium Logic (Rank 1, 2, 3)
  const top3 = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  // Layout order for podium: [Rank 2, Rank 1, Rank 3] to match image_d20b9c.png
  const podiumLayout = [
    { data: top3[1], rank: 2, color: "border-gray-400", h: "h-24", crown: "🥈" },
    { data: top3[0], rank: 1, color: "border-yellow-500", h: "h-32", crown: "🥇" },
    { data: top3[2], rank: 3, color: "border-orange-600", h: "h-20", crown: "🥉" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e5e7eb] font-sans">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="max-w-6xl mx-auto p-4"
      >
        {/* ACTION BAR */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/contests" className="text-[#ffa116] hover:text-[#ffb84d] transition-colors">
            ← Back to Contests
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handle_join_contest}
            className="bg-[#ffa116] text-black px-6 py-2 rounded font-bold shadow-lg"
          >
            Join Contest
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: PROBLEMS */}
          <div className="flex-1">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 bg-[#222] border-b border-[#2a2a2a] font-semibold">
                Contest Problems
              </div>
              <div className="p-2">
                {loading ? (
                  <div className="p-10 text-center text-gray-500">Loading...</div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-500 border-b border-[#2a2a2a]">
                        <th className="p-4">#</th>
                        <th className="p-4">Title</th>
                        <th className="p-4 text-center">Solved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((p, i) => (
                        <tr key={p._id} className="hover:bg-[#2a2a2a] transition-colors group">
                          <td className="p-4 text-[#ffa116] font-bold">
                            {p.index || String.fromCharCode(65 + i)}
                          </td>
                          <td className="p-4">
                            <Link to={`/program/${p.id}`} className="group-hover:text-[#ffa116] transition-colors">
                              {p.title}
                            </Link>
                          </td>
                          <td className="p-4 text-center text-gray-400">{p.solvedCount || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: LEADERBOARD (image_d20b9c.png Style) */}
          <div className="w-full lg:w-[400px]">
            <div className="flex flex-col gap-4">
              
              {/* Podium Section */}
              <div className="flex justify-center items-end gap-2 h-64 mb-4">
                {podiumLayout.map((spot, idx) => spot.data && (
                  <motion.div 
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="relative mb-2">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl">{spot.crown}</div>
                      <img 
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${spot.data.userEmail}`}
                        className={`w-16 h-16 rounded-full border-4 ${spot.color} bg-[#1a1a1a]`}
                        alt="avatar"
                      />
                    </div>
                    <div className="bg-[#222] border border-[#333] rounded-t-lg w-full p-2 text-center shadow-xl">
                      <p className="text-xs font-bold truncate text-[#ffa116]">
                        {formatUsername(spot.data.userEmail)}
                      </p>
                      <p className="text-[10px] text-gray-400">{spot.data.totalSolved} Solved</p>
                    </div>
                    <div className={`w-full ${spot.h} bg-gradient-to-b from-[#333] to-[#111] rounded-b-lg shadow-inner`} />
                  </motion.div>
                ))}
              </div>

              {/* Scrollable Rank List */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
              >
                {restOfLeaderboard.map((user, i) => (
                  <motion.div
                    variants={itemVariants}
                    key={user.userEmail}
                    className={`flex items-center justify-between p-3 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] ${
                      user.userEmail === profilEmail ? "border-[#ffa116] bg-[#252015]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-gray-500">{i + 4}</span>
                      <img 
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.userEmail}`}
                        className="w-10 h-10 rounded-full border border-[#333]"
                        alt="avatar"
                      />
                      <span className="font-medium text-sm">{formatUsername(user.userEmail)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Rating</p>
                      <p className="text-sm font-bold text-green-400">{user.totalSolved}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ContestPrograms;