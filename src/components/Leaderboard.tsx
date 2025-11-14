import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

interface Rank {
  email: string;
  numberOfProgram: number;
}

function Leaderboard() {
  const [ranks, setRanks] = useState<Rank[]>([]);

  useEffect(() => {
    axios
      .get("https://backend-nine-red-85.vercel.app/api/allrank")
      .then((res) => setRanks(res.data.rank))
      .catch((err) => console.error(err));
  }, []); 

  useEffect(() => {
    console.log(ranks);
  }, [ranks]);

  return (
    <div>
      {/* navabar section    */}
      <Navbar programdet={false} leaderboard={true} />

            {/* leaderboard ranking showing */}
      <div className="flex justify-center mt-10 px-4">
        <table className="w-full max-w-4xl border-separate border-spacing-y-2 text-left text-sm rounded-2xl overflow-hidden">
          <thead className="bg-zinc-900 text-gray-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-3 rounded-tl-2xl">Rank</th>
              <th className="p-3">Email</th>
              <th className="p-3 rounded-tr-2xl">Programs Solved</th>
            </tr>
          </thead>

          <tbody className="text-white">
            {ranks.length > 0 ? (
              ranks.map((element, index) => {
                // 🎖️ Rank colors
                let rankStyle = "bg-zinc-800";
                let crown = "";

                if (index === 0) {
                  rankStyle = "bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-semibold shadow-lg shadow-yellow-500/30";
                  crown = "👑";
                } else if (index === 1) {
                  rankStyle = "bg-gradient-to-r from-gray-300 to-gray-400 text-black font-semibold shadow-md shadow-gray-400/30";
                  crown = "🥈";
                } else if (index === 2) {
                  rankStyle = "bg-gradient-to-r from-amber-700 to-amber-500 text-black font-semibold shadow-md shadow-amber-500/30";
                  crown = "🥉";
                }

                return (
                  <tr
                    key={index}
                    className={`${rankStyle} transition-transform hover:scale-[1.02] rounded-xl`}
                  >
                    <td className="p-3 text-center">
                      {crown || index + 1}
                    </td>
                    <td className="p-3">{element.email}</td>
                    <td className="p-3 text-center">{element.numberOfProgram}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Leaderboard;
