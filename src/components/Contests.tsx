import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion"; // Added
import Navbar from "./Navbar";

interface Program {
  _id?: string;
  title: string;
}

interface conteststype {
  _id?: string;
  contestName: string;
}

const Contests: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [contestName, setContestName] = useState("");
  const [addedPrograms, setAddedPrograms] = useState<Program[]>([]);
  const [contests, setContests] = useState<conteststype[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://backend-nine-red-85.vercel.app/contests/programstitle")
      .then((res) => setAllPrograms(res.data.message))
      .catch(() => console.log("error"));
  }, []);

  useEffect(() => {
    axios
      .get("https://backend-nine-red-85.vercel.app/contests/allcontestslist")
      .then((res) => setContests(res.data.msg));
  }, [addedPrograms]);

  const handleAddProgram = (program: Program) => {
    if (!addedPrograms.some((p) => p.title === program.title)) {
      setAddedPrograms([...addedPrograms, program]);
    }
  };

  const handleRemoveProgram = (title: string) => {
    setAddedPrograms(addedPrograms.filter((p) => p.title !== title));
  };

  const handleCreateContest = async () => {
    await axios.post("https://backend-nine-red-85.vercel.app/contests/addcontest", {
      contestName,
      addedPrograms,
    });
    toast.success("Contest Created!");
    setContestName("");
    setAddedPrograms([]);
    setShowModal(false);
  };

  const filteredContests = contests.filter((c) =>
    c.contestName.toLowerCase().includes(search.toLowerCase())
  );

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e5e7eb] font-sans">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto p-4"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Contests</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="text-[#ffa116] hover:text-[#ffb84d] font-medium"
          >
            + Create Contest
          </motion.button>
        </div>

        {/* SEARCH */}
        <motion.input
          initial={{ width: "90%" }}
          animate={{ width: "100%" }}
          type="text"
          placeholder="Search contests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 bg-[#111] border border-[#2a2a2a] px-3 py-2 rounded-md focus:outline-none focus:border-[#ffa116] transition-colors"
        />

        {/* CONTEST LIST */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="border border-[#2a2a2a] rounded-lg bg-[#1a1a1a] overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-[#2a2a2a]">
                <th className="p-3 text-left">Contest</th>
                <th className="p-3 text-center">👤</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='popLayout'>
                {filteredContests.length === 0 ? (
                  <motion.tr key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td className="p-4 text-center text-gray-500" colSpan={2}>No contests found</td>
                  </motion.tr>
                ) : (
                  filteredContests.map((c) => (
                    <motion.tr 
                      key={c._id} 
                      variants={itemVariants}
                      layout
                      className="hover:bg-[#2a2a2a] transition-colors group"
                    >
                      <td className="p-3 flex items-center gap-3">
                        <motion.img
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${c._id}`}
                          className="w-8 h-8 rounded-full border border-[#333]"
                        />
                        <Link to={`/contests/${c._id}`} className="text-[#ffa116] group-hover:text-[#ffb84d] transition-colors">
                          {c.contestName}
                        </Link>
                      </td>
                      <td className="p-3 text-center text-gray-400">x0</td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-xl p-6 relative z-10 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4">Create Contest</h2>

              <input
                type="text"
                placeholder="Contest name"
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
                className="w-full mb-4 bg-[#0f0f0f] border border-[#333] px-4 py-2 rounded-lg focus:outline-none focus:border-[#ffa116]"
              />

              {/* ADDED PROGRAMS (Animated Chips) */}
              <div className="mb-4 flex flex-wrap gap-2 min-h-[32px]">
                <AnimatePresence>
                  {addedPrograms.map((p) => (
                    <motion.span
                      key={p.title}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      layout
                      className="bg-[#ffa116] text-black px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium"
                    >
                      {p.title}
                      <button onClick={() => handleRemoveProgram(p.title)} className="hover:text-white transition-colors">✕</button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* PROGRAM LIST */}
              <div className="max-h-48 overflow-y-auto border border-[#2a2a2a] rounded-lg mb-6 bg-[#0f0f0f]">
                {allPrograms.map((p, i) => {
                  const added = addedPrograms.some((x) => x.title === p.title);
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex justify-between p-3 border-b border-[#222] last:border-0"
                    >
                      <span className={added ? "text-gray-500" : "text-gray-200"}>{p.title}</span>
                      <button
                        disabled={added}
                        onClick={() => handleAddProgram(p)}
                        className={`text-sm font-bold ${added ? "text-green-500" : "text-[#ffa116] hover:brightness-125"}`}
                      >
                        {added ? "✓ Added" : "+ Add"}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateContest}
                  disabled={!contestName || addedPrograms.length === 0}
                  className="px-6 py-2 bg-[#ffa116] text-black font-bold rounded-lg disabled:opacity-30 disabled:grayscale"
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contests;