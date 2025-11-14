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
        // setLoading(false) is handled in .finally() to ensure it runs even on error
      })
      .finally(() => setLoading(false));
  }, []);

  // 2. Fetch user submissions
  useEffect(() => {
    // Only fetch submissions if the email is available
    if (email) {
      axios
        .post("https://backend-nine-red-85.vercel.app/programs/allsubmitions", {
          email,
        })
        .then((res) => {
          setSubmitions(res.data.programId);
        });
    }
  }, [email, setSubmitions]); // Added setSubmitions to dependency array for completeness

  // 3. Debug Submissions (Optional, but useful)
  useEffect(() => {
    // console.log("Current Submissions:", submitoins);
  }, [submitoins]);

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
    setOpenVideo(false);
    setVideoUrl("");
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <Navbar clock={false} />

      {/* Title with typewriter effect */}
      <TypewriterEffect words={words} className="mt-6 sm:mt-10" />

      {/* Main container for the responsive table */}
      <div className="flex justify-center mt-10">
        <table className="w-full max-w-4xl border-collapse text-left text-sm">
          <thead className="text-gray-400 uppercase border-b border-gray-600">
            <tr>
              <th className="p-3">STATUS</th>
              <th className="p-3">TITLE</th>
              <th className="p-3">DIFFICULTY</th>
              <th className="p-3">CATEGORY</th>
              <th className="p-3">SOLUTION</th>
            </tr>
          </thead>

          {loading ? (<tbody className="text-white">
          {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <tr key={idx} className="odd:bg-zinc-800 even:bg-zinc-700 animate-pulse">
              <td className="p-3"><div className="h-6 w-6 bg-gray-700 rounded"></div></td>
              <td className="p-3"><div className="h-4 bg-gray-700 rounded w-32"></div></td>
              <td className="p-3"><div className="h-4 bg-gray-700 rounded w-16"></div></td>
              <td className="p-3"><div className="h-4 bg-gray-700 rounded w-20"></div></td>
              <td className="p-3"><div className="h-6 w-6 bg-gray-700 rounded"></div></td>
            </tr>
          ))
          ) : (
          allprograms.map((_, index) => (
            <tr key={index} className="odd:bg-zinc-800 cursor-grab even:bg-zinc-700">
              {/* your table row content */}
            </tr>
          ))
          )}
          </tbody>
           ):
            (<tbody className="text-white">

            {allprograms && allprograms.map((element, index)=>(
              <tr key={index}  className="odd:bg-zinc-800 cursor-grab even:bg-zinc-700">
                <td className="p-3">{submitoins?.find(element=>element == index+1)? <svg xmlns="http://www.w3.org/2000/svg"fill="none"viewBox="0 0 24 24"stroke="currentColor"className={"w-6 h-6 text-green-500 ml-4"}><path strokeLinecap="round"strokeLinejoin="round"strokeWidth={3}d="M5 13l4 4L19 7"/></svg>:""}</td>
                <td onClick={()=>navigate(`/program/${element.id}`)} className="p-3 programHover">{element.title}</td>
                <td className="p-3 text-green-400">{element.difficulty}</td>
                <td className="p-3">{element.category}</td>
                <td className="p-3">
                  <svg onClick={()=>handle_videoOpen(element.solutionlink)} className="cursor-pointer size-8" xmlns="http://www.w3.org/2000/svg"width="2500"height="1756"viewBox="5.368 13.434 53.9 37.855"id="youtube"><path fill="#FFF"d="M41.272 31.81c-4.942-2.641-9.674-5.069-14.511-7.604v15.165c5.09-2.767 10.455-5.301 14.532-7.561h-.021z"></path><path fill="#E8E0E0"d="M41.272 31.81c-4.942-2.641-14.511-7.604-14.511-7.604l12.758 8.575c.001 0-2.324 1.289 1.753-.971z"></path><path fill="#CD201F"d="M27.691 51.242c-10.265-.189-13.771-.359-15.926-.803-1.458-.295-2.725-.95-3.654-1.9-.718-.719-1.289-1.816-1.732-3.338-.38-1.268-.528-2.323-.739-4.9-.323-5.816-.4-10.571 0-15.884.33-2.934.49-6.417 2.682-8.449 1.035-.951 2.239-1.563 3.591-1.816 2.112-.401 11.11-.718 20.425-.718 9.294 0 18.312.317 20.426.718 1.689.317 3.273 1.267 4.203 2.492 2 3.146 2.035 7.058 2.238 10.118.084 1.458.084 9.737 0 11.195-.316 4.836-.57 6.547-1.288 8.321-.444 1.12-.823 1.711-1.479 2.366a7.085 7.085 0 0 1-3.76 1.922c-8.883.668-16.426.813-24.987.676zM41.294 31.81c-4.942-2.641-9.674-5.09-14.511-7.625v15.166c5.09-2.767 10.456-5.302 14.532-7.562l-.021.021z"></path></svg>
              </td>
            </tr>
            ))}

          </tbody>)}
        </table>
      </div>

       {/* Popup Modal */}
      {openVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-700 rounded-xl shadow-xl p-4 w-[80%] max-w-3xl">
            <button
              onClick={handleClose}
              className="mb-2 px-3 cursor-pointer py-1 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-lg"
                src={videoUrl}
                title="Video"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}