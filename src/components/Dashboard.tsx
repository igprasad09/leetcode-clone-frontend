import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { TypewriterEffect } from "./ui/typewriter-effect";
import {
  useRecoilState,
  useRecoilValue
} from "recoil";
import {
  allprogramNamesAtom,
  profileEmailAtom,
  submitionAtom,
  wordsAtom,
} from "@/context";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const words = useRecoilValue(wordsAtom);
  const email = useRecoilValue(profileEmailAtom);
  const [allprograms, setAllprograms] = useRecoilState(allprogramNamesAtom);
  const [openVideo, setOpenVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [submitoins, setSubmitions] = useRecoilState(submitionAtom);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all programs
  useEffect(() => {
    axios
      .get("https://backend-nine-red-85.vercel.app/programs")
      .then((res) => {
        setAllprograms(res.data.programs);
      })
      .finally(() => setLoading(false));
  }, []);

  // 2. Fetch user submissions
  useEffect(() => {
    if (email) {
      axios
        .post("https://backend-nine-red-85.vercel.app/programs/allsubmitions", {
          email,
        })
        .then((res) => {
          setSubmitions(res.data.programId);
        });
    }
  }, [email, setSubmitions]);

  // Handle Video Modal Open
  function handle_videoOpen(url: string) {
    let videoId = "";

    // Extract video ID from different YouTube URL formats
    if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    setVideoUrl(embedUrl);
    setOpenVideo(true);
  }

  // Handle Video Modal Close
  function handleClose() {
    // Add a slight delay before unmounting to allow a closing animation if you wanted to add one later
    setOpenVideo(false);
    setVideoUrl("");
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen overflow-x-hidden">
      <Navbar clock={false} />

      {/* Title with typewriter effect */}
      <TypewriterEffect words={words} className="mt-6 sm:mt-10" />

      {/* Main container for the responsive table */}
      <div className="flex justify-center mt-10 px-4 pb-10">
        <div className="w-full max-w-4xl overflow-x-auto rounded-xl border border-zinc-700/50 shadow-2xl bg-zinc-900/50 backdrop-blur-sm animate-fade-in-up">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-zinc-400 uppercase border-b border-zinc-700 bg-zinc-900 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-semibold tracking-wider">Status</th>
                <th className="p-4 font-semibold tracking-wider">Title</th>
                <th className="p-4 font-semibold tracking-wider">Difficulty</th>
                <th className="p-4 font-semibold tracking-wider">Category</th>
                <th className="p-4 font-semibold tracking-wider text-center">Solution</th>
              </tr>
            </thead>

            <tbody className="text-zinc-200 divide-y divide-zinc-800/50">
              {loading ? (
                // Skeleton Loading State
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="bg-zinc-800/20 animate-pulse">
                    <td className="p-4"><div className="h-6 w-6 bg-zinc-700 rounded-full"></div></td>
                    <td className="p-4"><div className="h-5 bg-zinc-700 rounded w-48"></div></td>
                    <td className="p-4"><div className="h-5 bg-zinc-700 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-5 bg-zinc-700 rounded w-24"></div></td>
                    <td className="p-4 flex justify-center"><div className="h-8 w-12 bg-zinc-700 rounded-lg"></div></td>
                  </tr>
                ))
              ) : (
                // Actual Data Rows
                allprograms && allprograms.map((element, index) => (
                  <tr 
                    key={index} 
                    className="group hover:bg-zinc-800/80 transition-all duration-300 cursor-pointer animate-slide-in-row opacity-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4">
                      {submitoins?.find(el => el == index + 1) ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 animate-scale-in">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-zinc-600">-</div>
                      )}
                    </td>
                    <td 
                      onClick={() => navigate(`/program/${element.id}`)} 
                      className="p-4 font-medium group-hover:text-white transition-colors"
                    >
                      {element.title}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide 
                        ${element.difficulty.toLowerCase() === 'easy' ? 'text-green-400 bg-green-400/10' : 
                          element.difficulty.toLowerCase() === 'medium' ? 'text-yellow-400 bg-yellow-400/10' : 
                          'text-red-400 bg-red-400/10'}`}>
                        {element.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      {element.category}
                    </td>
                    <td className="p-4 flex justify-center">
                      <svg 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click if they click the video
                          handle_videoOpen(element.solutionlink);
                        }} 
                        className="cursor-pointer w-9 h-auto opacity-70 group-hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(205,32,31,0.6)] transition-all duration-300 active:scale-95" 
                        xmlns="http://www.w3.org/2000/svg" width="2500" height="1756" viewBox="5.368 13.434 53.9 37.855" id="youtube"
                      >
                        <path fill="#FFF" d="M41.272 31.81c-4.942-2.641-9.674-5.069-14.511-7.604v15.165c5.09-2.767 10.455-5.301 14.532-7.561h-.021z"></path>
                        <path fill="#E8E0E0" d="M41.272 31.81c-4.942-2.641-14.511-7.604-14.511-7.604l12.758 8.575c.001 0-2.324 1.289 1.753-.971z"></path>
                        <path fill="#CD201F" d="M27.691 51.242c-10.265-.189-13.771-.359-15.926-.803-1.458-.295-2.725-.95-3.654-1.9-.718-.719-1.289-1.816-1.732-3.338-.38-1.268-.528-2.323-.739-4.9-.323-5.816-.4-10.571 0-15.884.33-2.934.49-6.417 2.682-8.449 1.035-.951 2.239-1.563 3.591-1.816 2.112-.401 11.11-.718 20.425-.718 9.294 0 18.312.317 20.426.718 1.689.317 3.273 1.267 4.203 2.492 2 3.146 2.035 7.058 2.238 10.118.084 1.458.084 9.737 0 11.195-.316 4.836-.57 6.547-1.288 8.321-.444 1.12-.823 1.711-1.479 2.366a7.085 7.085 0 0 1-3.76 1.922c-8.883.668-16.426.813-24.987.676zM41.294 31.81c-4.942-2.641-9.674-5.09-14.511-7.625v15.166c5.09-2.767 10.456-5.302 14.532-7.562l-.021.021z"></path>
                      </svg>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal */}
      {openVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={handleClose}
          />
          
          {/* Animated Modal Content */}
          <div className="relative bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-4 w-full max-w-4xl animate-modal-pop">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-zinc-200 font-semibold ml-2">Video Solution</h3>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center bg-zinc-700/50 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                className="w-full h-full"
                src={videoUrl}
                title="Video"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* ── Global Styles & Keyframes ── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRow {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.5); }
          60% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-in-row {
          animation: slideInRow 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-modal-pop {
          animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}