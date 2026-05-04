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
  const [stdout, setStdout] = useState<string | null>(null);
  const [stderr, setStderr] = useState("");
  const email = useRecoilValue(profileEmailAtom);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useRecoilState(outputAtom);
  const [result, setResult] = useState<boolean[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [topHeight, setTopHeight] = useState(60);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;
    const startHeight = topHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const totalHeight = containerRef.current.clientHeight;
      const offsetY = moveEvent.clientY - startY;
      const newHeight = startHeight + (offsetY / totalHeight) * 100;
      
      if (newHeight > 20 && newHeight < 80) {
        setTopHeight(newHeight);
      }
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
    if (language === "python") setCode(programInfo.starterCode.python);
    else if (language === "c") setCode(programInfo.starterCode.cpp);
    else setCode(programInfo.starterCode.javascript);
  }, [language, programInfo]);

  function handle_test(index: number) {
    setTemp(index);
  }

  async function handle_code_execute() {
    if (!email || email.trim() === "") return toast.error("Login is required!");
    setLoading(true);

    const safeStdio = Array.isArray(programInfo.stdio) && programInfo.stdio.length > 0
      ? programInfo.stdio
      : programInfo.testCases.map(() => ({ python: "", javascript: "", c: "", java: "" }));

    try {
      const response = await axios.post("https://backend-nine-red-85.vercel.app/programs/programexicute", {
        email, code, language, testCases: programInfo.testCases, stdio: safeStdio
      });

      if (response.data.message) {
        setLoading(false);
        return toast.error(response.data.message);
      }

      setStdout(response.data?.results?.[0]?.output?.stdout || "");
      setStderr(response.data?.results?.[0]?.output?.stderr || "");
      
      toast.info("Check outputs panel");
      setLoading(false);
      setOutput(response.data.results);
      setOutputBtn(true);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      const backendErrorMessage = err.response?.data?.message || err.response?.data?.error || "Execution failed.";
      toast.error(backendErrorMessage);
    }
  }

  useEffect(() => {
    type TestCase = { expectedOutput: string };
    type OutputItem = { output: { stdout: string | null; }; };

    const testcases = (programInfo?.testCases as TestCase[] | undefined)?.map(el => el.expectedOutput);
    const exeOutputs = Array.isArray(output) ? (output as OutputItem[]).map(el => el.output.stdout) : undefined;

    const cleaned = exeOutputs?.map((item: string | null) => {
      const stripped = (item || "").trim();
      return !isNaN(Number(stripped)) && stripped !== "" ? Number(stripped) : stripped;
    });

    if (testcases && cleaned) {
      const newResult = cleaned.map((element: string | number, index: number) => element == testcases[index]);
      setResult(newResult);
    } else {
      setResult([]);
    }
  }, [output, programInfo]);

  useEffect(() => {
    if (programInfo) setResult(Array(programInfo.testCases.length).fill(undefined));
  }, [programInfo]);

  async function handle_submit() {
    if (email === "") return toast.error("Email is required");
    if (result.some(element => element === undefined)) return toast("First run the code");
    if (result.some(element => element === false)) return toast.error("All cases need to pass");

    try {
      await axios.post("https://backend-nine-red-85.vercel.app/programs/submit", { email, id: programInfo.id });
      toast.success("Submission successful");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  if (!programInfo) {
    return (
      <div className="h-full w-full space-y-2">
        <div className="bg-zinc-900 rounded-lg h-[60%] w-full animate-pulse border border-zinc-800"></div>
        <div className="bg-zinc-900 rounded-lg h-[40%] w-full animate-pulse border border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col w-full min-h-0">
      <div 
        className="bg-zinc-900 flex flex-col rounded-lg border border-zinc-800 overflow-hidden" 
        style={{ height: `${topHeight}%` }}
      >
        <div className="bg-zinc-900 border-b border-zinc-800 p-1.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CustomizedMenus />
          </div>
          <div className="flex items-center gap-3 pr-2">
            <AlertDialogDemo>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </AlertDialogDemo>
          </div>
        </div>

        <div className="flex-1 min-h-0 pt-2">
          <Editor
            height="100%"
            language={language === "python" ? "python" : "javascript"}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            options={{ 
              fontSize: textSize, 
              minimap: { enabled: false }, 
              padding: { top: 10 },
              contextmenu: false, // Disables right-click in editor
              links: false, // Disables clickable links
            }}
            onMount={(editor) => {
              editor.onKeyDown((e:any) => {
                // 52 is the keyCode for 'V' in Monaco's internal event system (Block Paste)
                if ((e.ctrlKey || e.metaKey) && e.keyCode === 52) {
                  e.preventDefault();
                  toast.error("Pasting code is not allowed!");
                }
                
                // 33 is the keyCode for 'C' in Monaco's internal event system (Block Copy)
                if ((e.ctrlKey || e.metaKey) && e.keyCode === 33) {
                  e.preventDefault();
                  toast.error("Copying code is not allowed!");
                }
              });
            }}
          />
        </div>
      </div>

      <div
        className="h-2 w-full cursor-row-resize flex justify-center items-center group shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="w-12 h-1 rounded-full bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div 
        className="bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col overflow-hidden"
        style={{ height: `calc(${100 - topHeight}% - 8px)` }}
      >
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex gap-4">
            <button 
              onClick={() => setOutputBtn(false)} 
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${!outputBtn ? "text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Testcases
            </button>
            <button 
              onClick={() => setOutputBtn(true)} 
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${outputBtn ? "text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" /></svg>
              Test Result
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handle_code_execute}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors rounded px-4 py-1.5 text-sm font-semibold flex items-center gap-1.5"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd"/></svg>
              )}
              Run
            </button>
            <button 
              onClick={handle_submit} 
              className="bg-zinc-800 hover:bg-green-500/10 text-green-500 transition-colors rounded px-4 py-1.5 text-sm font-semibold flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/></svg>
              Submit
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-zinc-900">
          {outputBtn ? (
            <div className="font-mono text-sm space-y-2">
              <p className={`p-4 rounded-lg bg-zinc-950 border border-zinc-800 ${stdout ? "text-zinc-300" : ""} ${stderr ? "text-red-400" : ""}`}>
                {stdout === "" ? <ErrorDisplay errorOutput={stderr} /> : stdout}
                {!stdout && !stderr && <span className="text-zinc-500 italic">Run code to see output here.</span>}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {programInfo.testCases.map((_: string, index: number) => {
                  const isSelected = temp === index;
                  const isPassed = result[index] === true;
                  const isFailed = result[index] === false;

                  let btnClass = "cursor-pointer font-semibold text-sm px-4 py-1.5 rounded-lg transition-all duration-200 ";

                  if (isPassed) {
                    btnClass += isSelected 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-green-500/5 text-green-500 opacity-60 hover:opacity-100 hover:bg-green-500/10";
                  } else if (isFailed) {
                    btnClass += isSelected 
                      ? "bg-red-500/20 text-red-400" 
                      : "bg-red-500/5 text-red-500 opacity-60 hover:opacity-100 hover:bg-red-500/10";
                  } else {
                    btnClass += isSelected 
                      ? "bg-zinc-700 text-white" 
                      : "bg-zinc-950 text-zinc-400 hover:bg-zinc-800";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handle_test(index)}
                      className={btnClass}
                    >
                      Case {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 mb-1.5 ml-1">Input</p>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-sm text-zinc-300">
                    {programInfo.testCases[temp].input}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 mb-1.5 ml-1">Expected Output</p>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-sm text-zinc-300">
                    {programInfo.testCases[temp].expectedOutput}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
