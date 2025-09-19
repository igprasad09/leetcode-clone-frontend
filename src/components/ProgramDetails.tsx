import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import Navbar from "./Navbar";
import { toast } from "sonner";
import { useSetRecoilState } from "recoil";
import {  profileEmailAtom, programInfoAtom } from "@/context";
import Leftside from "./Leftside";
import Rightside from "./Rightside";

export default function ProgramDetails() {
    const {id} = useParams();
    const setProfileEmail = useSetRecoilState(profileEmailAtom);
    const setProgramInfo = useSetRecoilState(programInfoAtom);

    useEffect(()=>{
         axios.post("https://backend-nine-red-85.vercel.app/programs/programinfo",{id}).then((res)=>{
                setProgramInfo(res.data.info as any)
         })
    },[id]);

    function handle_logout(){
          axios.post("https://backend-nine-red-85.vercel.app/logout",{},{withCredentials: true}).then((res)=>{
                toast.success(res.data.message)
                setProfileEmail("")
          });
      }

  const [dividerX, setDividerX] = useState(50); // % width for left side
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newPercent = (e.clientX / window.innerWidth) * 100;
    if (newPercent > 10 && newPercent < 90) setDividerX(newPercent);
  };

  // Attach global listeners for dragging
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
  return (
    <div className=" bg-zinc-900 h-screen w-screen overflow-hidden  ">
        <Navbar log_out_click={handle_logout} clock={true} programdet={true}/>

        <div className="w-screen h-screen flex">
      {/* Left */}
      <div
        className="bg-zinc-800 overflow-y-scroll "
        style={{ width: `${dividerX}%` }}
      >
        <Leftside/>
      </div>

      {/* Divider */}
      <div
        className="bg-zinc-900 w-2 cursor-col-resize"
        onMouseDown={handleMouseDown}
      ></div>

      {/* Right */}
      <div
        className="bg-zinc-700 flex-1 "
        style={{ width: `${100 - dividerX}%` }}
      >
        <Rightside/>
      </div>
    </div>

    </div>
  )
}
