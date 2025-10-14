import { profileEmailAtom, submitionAtom } from "@/context";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";

type Props = {
   log_out_click?: ()=>void,
   clock?: boolean,
   programdet?: boolean
}
export default function Navbar({ clock, programdet}: Props) {
  const profileEmail = useRecoilValue(profileEmailAtom);
  const [hover, setHover] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState({
            hr: 0,
            mi: 0,
            sec: 0
  });
 
  const setProfileEmail = useSetRecoilState(profileEmailAtom);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const setSubmitions = useSetRecoilState(submitionAtom);

  function start_clock(){
         setStartTimer(true)     
  }
  
  useEffect(()=>{
       let intervalId : NodeJS.Timeout | undefined;
       if(startTimer){
          intervalId = setInterval(() => {
            setTimer(prev=>({...prev, sec: prev.sec + 1}))
           }, 1000);
       }else{
           setTimer(prev=>({...prev, hr: 0, mi: 0,sec: 0}));
       }
       return ()=>{
           if(intervalId) clearInterval(intervalId);
       }
  },[startTimer]);

  useEffect(()=>{
      if(timer.sec == 60){
          setTimer(prev=>({...prev, mi: prev.mi+1, sec: 0}))
      }
      if(timer.mi == 60){
          setTimer(prev=>({...prev, hr: prev.hr+1, mi: 0}))
      }
  },[timer])

  function stop_clock(){
         setStartTimer(false);
  }
  const {id} = useParams();

  useEffect(() => {
    axios
      .get("https://backend-nine-red-85.vercel.app/verify", { withCredentials: true })
      .then((res) => {
        setUser(res.data.message);
      })
      .catch(() => {
        setUser(null)});
  }, []);
 
  useEffect(() => {
  if (user) {
    setProfileEmail(user.email ?? user.emails?.[0]?.value ?? "")
  }
}, [user]);

function handle_logout(){
      if(profileEmail == ""){
          toast.message("You already Logout")
      }else{
        axios.post("https://backend-nine-red-85.vercel.app/logout",{},{withCredentials: true}).then((res)=>{
            toast.success(res.data.message)
            setProfileEmail("")
            setSubmitions([]);
      });
      }
  }
  
  return (
    <div className="bg-zinc-800 h-13 w-full flex justify-between items-center">
      <div className="ml-4">
        <img
          className="w-25"
          src="https://res.cloudinary.com/dcazlekl5/image/upload/v1757174750/logo-full_vkvbhy.png"
        />
      </div>
      
      {/* we can change the program by clicking this button */}

      {programdet && <div className="text-zinc-400 ml-25 flex justify-center items-center ">
          <button onClick={()=>{
               if(!id) return;
               const num = parseInt(id);
               if(num <= 1  ) return toast("🤐")
               navigate(`/program/${num-1}`)
          }} className="bg-neutral-700 m-3 rounded-sm cursor-pointer">
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="32" height="32" id="left-arrow"><path d="m12.3 17.71 6.486 6.486a1 1 0 0 0 1.414-1.414L14.418 17l5.782-5.782a1 1 0 0 0-1.414-1.414L12.3 16.29a.997.997 0 0 0-.292.71c0 .258.096.514.292.71z"></path></svg>
          </button>
          
          <svg className="size-4 text-zinc-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" id="menu" width="96" height="96" x="0" y="0" version="1.1" viewBox="0 0 96 96"><switch><foreignObject width="1" height="1" x="0" y="0" requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/"></foreignObject><g><path d="M12 28h72a4 4 0 0 0 0-8H12a4 4 0 0 0 0 8zm72 16H12a4 4 0 0 0 0 8h72a4 4 0 0 0 0-8zm0 24H12a4 4 0 0 0 0 8h72a4 4 0 0 0 0-8z"></path></g></switch></svg>
          <button onClick={()=>navigate(`/dashboard`)} className=" cursor-pointer font-semibold text-zinc-200">Program List</button>

          <button onClick={() => {
               if(!id) return;
               const num = parseInt(id, 10); 
               if(num >= 50) return toast("Nothing")
               navigate(`/program/${String(num+1)}`);
           }} className="bg-neutral-700 m-3 rounded-sm cursor-pointer">
               <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" id="right-arrow"><path d="M13.8 24.196a1 1 0 0 0 1.414 0L21.7 17.71a.992.992 0 0 0 .292-.71.997.997 0 0 0-.292-.71l-6.486-6.486a1 1 0 0 0-1.414 1.414L19.582 17 13.8 22.782a1 1 0 0 0 0 1.414z"></path></svg>
          </button>
      </div>}

      <div className="">
        <div className="flex justify-center items-center text-amber-500">
          <button onClick={()=>navigate("/signup")} className="p-1 cursor-pointer mr-4 rounded-sm pl-3 pr-3 bg-neutral-700">
            Login
          </button>

         {clock ? 
             startTimer ? <>
                 <button onClick={stop_clock} className="bg-neutral-700 transition-all duration-300 ease-in-out p-1 flex rounded-sm mr-4 cursor-pointer">
                  <p className="text-md px-2 transition-all duration-300 ease-in-out">{timer.hr}:{timer.mi}:{timer.sec}</p>
                  <svg className="size-6 text-orange-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24"><path d="M 3.5 2 C 3.372 2 3.2444844 2.0494844 3.1464844 2.1464844 C 2.9514844 2.3414844 2.9514844 2.6585156 3.1464844 2.8535156 L 5.09375 4.8007812 C 3.1950225 6.6199194 2 9.1685121 2 12 C 2 17.511334 6.4886661 22 12 22 C 17.511334 22 22 17.511334 22 12 C 22 6.864114 18.106486 2.6175896 13.109375 2.0644531 A 1.0001 1.0001 0 0 0 13.009766 2.0585938 A 1.0001 1.0001 0 0 0 12.890625 4.0527344 C 16.891514 4.4955979 20 7.871886 20 12 C 20 16.430666 16.430666 20 12 20 C 7.5693339 20 4 16.430666 4 12 C 4 9.7105359 4.967513 7.6643975 6.5039062 6.2109375 L 8.1464844 7.8535156 C 8.3414844 8.0485156 8.6585156 8.0485156 8.8535156 7.8535156 C 8.9515156 7.7565156 9 7.628 9 7.5 L 9 3 A 1 1 0 0 0 8 2 L 3.5 2 z"></path></svg>
                </button>
             </>: <>
                <button onClick={start_clock} className="bg-neutral-700 p-1 rounded-sm mr-4 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M5 2L2 5" /><path d="M22 5L19 2" /><path d="M10 13L12 11" /><path d="M12 11L14 13" /><path d="M12 13V9" /></svg>
               </button>
            </>
         :<></> }

         {/* Profile avatar with hover */}
          <div
            className="relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <img
              className="w-8 h-8 mr-4 cursor-pointer rounded-full"
              src={"https://res.cloudinary.com/dcazlekl5/image/upload/v1757174737/avatar_hkcn7o.png"}
              alt="profile"
            />

            {hover && (
              <div key={profileEmail} className="absolute z-10 right-0 mt-1 bg-neutral-700 text-white rounded-md shadow-lg p-2">
                <p className="px-3 py-2 hover:bg-neutral-600 cursor-pointer">
                  {profileEmail? profileEmail : "No login"}
                </p>
              </div>
            )}
          </div>

          {/* Logout button (optional if you keep it in hover menu) */}
          <button
            onClick={handle_logout}
            className="p-2 mr-4 rounded-sm bg-neutral-700"
          >
            <img
              className="w-4"
              src="https://res.cloudinary.com/dcazlekl5/image/upload/v1757210304/exit-svgrepo-com_2_zi4y53.png"
              alt="logout"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
