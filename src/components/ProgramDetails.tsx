import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { toast } from "sonner";
import { useSetRecoilState } from "recoil";
import { profileEmailAtom, programInfoAtom } from "@/context";
import Leftside from "./Leftside";
import Rightside from "./Rightside";
import SecurityMonitor from "./SecurityMonitor";
import { useExamSecurity } from "./hooks/useExamSecurity";

export default function ProgramDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setProfileEmail = useSetRecoilState(profileEmailAtom);
  const setProgramInfo = useSetRecoilState(programInfoAtom);
  
  const [isExamStarted, setIsExamStarted] = useState(false);
  useExamSecurity(isExamStarted);

  useEffect(() => {
    axios.post("https://backend-nine-red-85.vercel.app/programs/programinfo", { id }).then((res) => {
      setProgramInfo(res.data.info as any);
    });
  }, [id, setProgramInfo]);

  function handle_logout() {
    axios.post("https://backend-nine-red-85.vercel.app/logout", {}, { withCredentials: true }).then((res) => {
      toast.success(res.data.message);
      setProfileEmail("");
    });
  }

  const startExam = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => {
        setIsExamStarted(true);
      }).catch(() => {
        toast.error("Failed to enter fullscreen.");
      });
    } else {
      toast.error("Fullscreen is not supported by your browser.");
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isExamStarted) {
        toast.error("Exiting fullscreen is a violation! Redirecting...");
        navigate("/dashboard");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isExamStarted, navigate]);

  const [dividerX, setDividerX] = useState(50);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.cursor = "default";
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newPercent = (e.clientX / window.innerWidth) * 100;
    if (newPercent > 20 && newPercent < 80) setDividerX(newPercent);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-zinc-950 h-screen w-screen flex flex-col overflow-hidden text-zinc-300 relative">
      
      {/* AI Webcam Monitor (Only runs if exam is started) */}
      {isExamStarted && <SecurityMonitor />}

      {/* LeetCode Style Start Screen */}
      {!isExamStarted && (
        <div className="absolute inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl max-w-2xl w-full shadow-2xl animate-[fadeIn_0.5s_ease-out]">
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800/60">
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Assessment Environment</h1>
                <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  AI Proctored Session
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 transition-colors hover:border-zinc-700">
                <svg className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                <div>
                  <h3 className="text-white font-medium text-sm">Fullscreen & Camera Required</h3>
                  <p className="text-zinc-500 text-xs mt-1">Exiting fullscreen or covering your camera will result in termination.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 transition-colors hover:border-zinc-700">
                <svg className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <div>
                  <h3 className="text-white font-medium text-sm">No Copy, Paste, or Phones</h3>
                  <p className="text-zinc-500 text-xs mt-1">External code cannot be pasted. Our AI will detect if a mobile device is present.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 transition-colors hover:border-zinc-700">
                <svg className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <div>
                  <h3 className="text-white font-medium text-sm">No Tab Switching</h3>
                  <p className="text-zinc-500 text-xs mt-1">Navigating away from this tab or using Alt+Tab will trigger a security violation.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={startExam}
              className="w-full relative group overflow-hidden rounded-xl bg-white text-black font-semibold py-4 transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              Start Assessment
            </button>
          </div>
        </div>
      )}

      <Navbar log_out_click={handle_logout} clock={true} programdet={true} />

      <div className="flex-1 w-screen flex overflow-hidden p-2 gap-1.5">
        <div
          className="h-full rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900"
          style={{ width: `${dividerX}%` }}
        >
          <Leftside />
        </div>

        <div
          className="w-1.5 flex justify-center items-center cursor-col-resize group z-10"
          onMouseDown={handleMouseDown}
        >
          <div className="h-16 w-0.5 rounded-full bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div
          className="h-full flex flex-col gap-1.5"
          style={{ width: `${100 - dividerX}%` }}
        >
          <Rightside />
        </div>
      </div>
    </div>
  );
}