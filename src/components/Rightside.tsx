import { languageAtom, outputAtom, profileEmailAtom, programInfoAtom, textsizeAtom } from "@/context";
import { useRecoilState, useRecoilValue } from "recoil";
import CustomizedMenus from "./ui/LanguageMenuBtn";
import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { AlertDialogDemo } from "./ui/SettingDailog";
import axios from "axios";
import ErrorDisplay from "./ui/DisplayEror";
import { toast } from "sonner";

export default function Rightside() {
  const programInfo = useRecoilValue(programInfoAtom);
  const [code, setCode] = useState("// write your code here");
  const [temp, setTemp] = useState(0);
  const textSize = useRecoilValue(textsizeAtom);
  const language = useRecoilValue(languageAtom);
  const [outputBtn, setOutputBtn] = useState(false);
  const [stdout, setStdout] = useState(null);
  const [stderr, setStderr] = useState("");
  const email = useRecoilValue(profileEmailAtom);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useRecoilState(outputAtom);
  const [result, setResult] = useState<boolean[]>([]);

  // ✅ always call hooks at top
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [topHeight, setTopHeight] = useState(200);
  const dividerHeight = 6;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;
    const startHeight = topHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const offsetY = moveEvent.clientY - startY;
      setTopHeight(startHeight + offsetY);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "row-resize";
  };

   useEffect(() => {
  if (!programInfo) return;

  if (language === "python") {
    setCode(programInfo.starterCode.python);
  } else if (language === "c") {
    setCode(programInfo.starterCode.cpp);
  } else {
    setCode(programInfo.starterCode.javascript);
  }
}, [language, programInfo]);
  
  function handle_test(index: number){
       setTemp(index)
  }

 const toggleFullScreen = () => {
    const doc = document as any; // for vendor-prefixed props
    const docEl = document.documentElement as any;

    // If already in fullscreen → exit
    if (
      doc.fullscreenElement ||
      doc.mozFullScreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement
    ) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    } else {
      // Not in fullscreen → request
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    }
  };
  
  async function handle_code_execute() {
         setLoading(true)
         try{
          const response = await axios.post("https://backend-nine-red-85.vercel.app/programs/programexicute", 
             {email,code, language, testCases: programInfo.testCases, stdio: programInfo.stdio});
             if(response.data.message){
              setLoading(false);
              return toast.error(response.data.message);
         }
         setStdout(response.data?.results[0].output.run.stdout)
         setStderr(response.data?.results[0].output.run.stderr)
         if(response.data){
            toast.info("check in outputs")
         }
         setLoading(false)
        setOutput(response.data.results);
         }catch(err){
             console.log(err)
             setLoading(false)
             toast.error("server Busy....")
         }
         
  }

  useEffect(() => {
  type TestCase = { expectedOutput: string };
  type OutputItem = { output: { run: { stdout: string } } };

  const testcases = (programInfo?.testCases as TestCase[] | undefined)?.map(
    (element) => element.expectedOutput
  );

  const exeOutputs = Array.isArray(output)
    ? (output as OutputItem[]).map((element) => element.output.run.stdout)
    : undefined;

  const cleaned = exeOutputs?.map((item: string) => {
    const stripped = item.trim();
    return !isNaN(Number(stripped)) && stripped !== ''
      ? Number(stripped)
      : stripped;
  });

  if (testcases && cleaned) {
    const newResult = cleaned.map((element, index) => {
      return element == testcases[index];
    });
    setResult(newResult); // ✅ updates to boolean[]
  } else {
    // if no cleaned or no testcases → reset to empty array
    setResult([]);
  }
}, [output, programInfo]);
   
  useEffect(()=>{
     console.log(result)
  },[result])

  useEffect(() => {
  if (programInfo) {
    // reset to empty or undefined for new test cases
    setResult(Array(programInfo.testCases.length).fill(undefined));
  }
}, [programInfo]);
 
  async function handle_submit() {
  if (email === "") {
    return toast.error("Email is required");
  }

  // Check if any element is undefined
  if (result.some(element => element === undefined)) {
    return toast("First run the code");
  }

  // Check if any test case failed
  if (result.some(element => element === false)) {
    return toast.error("All cases need to pass");
  }

  // All checks passed → send data
  try {
    const res = await axios.post("https://backend-nine-red-85.vercel.app/programs/submit", {
      email,
      id: programInfo.id
    });
    console.log(res.data);
    toast.success("Submission successful");
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
}


 
      // ✅ do conditional rendering AFTER hooks
      if (!programInfo) {
      return (
        <div className="h-screen bg-zinc-900 p-4 space-y-4">
          {/* Top skeleton: editor */}
          <div className="bg-zinc-800 animate-pulse rounded-md h-[60%] w-full"></div>

          {/* Divider */}
          <div className="bg-zinc-600 h-2 w-full rounded"></div>

          {/* Bottom skeleton: testcases/output */}
          <div className="bg-zinc-800 animate-pulse rounded-md h-[35%] w-full space-y-2 p-4">
            <div className="h-6 bg-zinc-700 rounded w-32"></div> {/* Buttons skeleton */}
            <div className="h-6 bg-zinc-700 rounded w-40"></div>
            <div className="h-4 bg-zinc-700 rounded w-full mt-2"></div> {/* Input */}
            <div className="h-4 bg-zinc-700 rounded w-full mt-1"></div>
            <div className="h-4 bg-zinc-700 rounded w-full mt-1"></div>
          </div>
        </div>
      );
    }
  return (
    <div className="">
      <div className="bg-zinc-900 flex items-center justify-between text-black">
         <div className="flex items-center">
            <CustomizedMenus />
         <button
      onClick={handle_code_execute}
      className="bg-neutral-800 cursor-pointer ml-3 p-1 rounded-sm flex items-center justify-center w-[40px] h-[40px]"
    >
      {loading ? (
        // ⬇️ Loading Spinner SVG
        <svg
          className="animate-spin w-[24px] h-[24px] text-gray-300 dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        // ⬇️ Your original play SVG
        <svg
          className="w-[28px] h-[28px] text-gray-300 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
        <button onClick={handle_submit} className="text-green-500 bg-neutral-800 p-1.5 ml-3 rounded-sm cursor-pointer flex font-semibold justify-center"><svg className="text-green-500 mr-1 w-[23px] h-[23px] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/></svg>
        Submit</button>
         </div>
         <div className="flex items-center">
             <AlertDialogDemo><svg className="w-[23px] cursor-pointer h-[23px] text-neutral-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg></AlertDialogDemo>
             <svg onClick={toggleFullScreen} className="w-[23px] cursor-pointer ml-2 mr-2 h-[23px] text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm16 7H4v7h16v-7ZM5 8a1 1 0 0 1 1-1h.01a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1Zm4-1a1 1 0 0 0 0 2h.01a1 1 0 0 0 0-2H9Zm2 1a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z" clipRule="evenodd"/></svg>
         </div>
      </div>

      <div ref={containerRef} className="h-screen flex flex-col">
        {/* Top Div */}
        <div
          className="bg-neutral-800 overflow-auto z-0"
          style={{ height: `${topHeight+90}px` }}
        >
          <Editor
            height="100%" // ✅ fill parent
            language={language === "python" ? "python" : "javascript"}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: textSize
            }}
          />
        </div>


        {/* Divider */}
        <div
          onMouseDown={handleMouseDown}
          className="bg-zinc-600 hover:bg-gray-500  cursor-row-resize"
          style={{ height: `${dividerHeight}px` }}
        />

        {/* Bottom Div */}
        <div className="bg-zinc-800 flex-1 overflow-auto">
            <div className="flex items-center ">
               <h1 onClick={()=>setOutputBtn(false)} className=" underline cursor-pointer m-4 font-semibold">Testcases</h1>
               <button onClick={()=>setOutputBtn(true)} className="bg-red-600 font-semibold px-3 py-1 rounded-sm hover:bg-red-500 cursor-pointer">Outputs</button>
            </div>
            {outputBtn?<div className="bg-black ">
                <p className={`p-4 italic font-mono ${stdout != ""? "text-green-400":""} ${stderr != ""? "text-red-400":""}`}>{stdout == ""? <ErrorDisplay errorOutput={stderr}/> : stdout}</p>
            </div>:
            <>
             <div className="flex">
                {programInfo.testCases.map((_: string, index: number) => (
            <button
              key={index}
              onClick={() => handle_test(index)}
              className={`cursor-pointer font-semibold px-3 ml-3 rounded-sm py-1 ${
                result[index] === undefined
                  ? "bg-neutral-700" // fallback
                  : result[index]
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              Case {index + 1}
            </button>


            ))}

            </div>
            <p className="ml-4 mt-4 font-bold font-mono">Input:</p>
            <div className="ml-4 bg-neutral-700 rounded-sm mr-4 p-2 font-semibold">{programInfo.testCases[temp].input}</div>
            <p className="ml-4 mt-4 font-semibold font-mono">Expected Output:</p>
            <div className="ml-4 bg-neutral-700 rounded-sm mr-4 p-2 font-semibold">{programInfo.testCases[temp].expectedOutput}</div>
            </>}
            
        </div>
      </div>
    </div>
  );
}
