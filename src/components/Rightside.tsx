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

    const safeStdio =
      Array.isArray(programInfo.stdio) && programInfo.stdio.length > 0
        ? programInfo.stdio
        : programInfo.testCases.map(() => ({ python: "", javascript: "", c: "", java: "" }));

    try {
      const response = await axios.post(
        "https://backend-nine-red-85.vercel.app/programs/programexicute",
        {
          email,
          code,
          language,
          testCases: programInfo.testCases,
          stdio: safeStdio,
        }
      );

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
      const backendErrorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Execution failed.";
      toast.error(backendErrorMessage);
    }
  }

  useEffect(() => {
    type TestCase = { expectedOutput: string };
    type OutputItem = { output: { stdout: string | null } };

    const testcases = (programInfo?.testCases as TestCase[] | undefined)?.map(
      (el) => el.expectedOutput
    );
    const exeOutputs = Array.isArray(output)
      ? (output as OutputItem[]).map((el) => el.output.stdout)
      : undefined;

    const cleaned = exeOutputs?.map((item: string | null) => {
      const stripped = (item || "").trim();
      return !isNaN(Number(stripped)) && stripped !== ""
        ? Number(stripped)
        : stripped;
    });

    if (testcases && cleaned) {
      const newResult = cleaned.map(
        (element: string | number, index: number) =>
          element == testcases[index]
      );
      setResult(newResult);
    } else {
      setResult([]);
    }
  }, [output, programInfo]);

  useEffect(() => {
    if (programInfo)
      setResult(Array(programInfo.testCases.length).fill(undefined));
  }, [programInfo]);

  async function handle_submit() {
    if (email === "") return toast.error("Email is required");
    if (result.some((element) => element === undefined))
      return toast("First run the code");
    if (result.some((element) => element === false))
      return toast.error("All cases need to pass");

    try {
      await axios.post(
        "https://backend-nine-red-85.vercel.app/programs/submit",
        { email, id: programInfo.id }
      );
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
          <CustomizedMenus />
          <AlertDialogDemo />
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
              contextmenu: false,
              links: false,
            }}
            onMount={(editor) => {
              editor.onKeyDown((e: any) => {
                // Block paste (Ctrl + V)
                if ((e.ctrlKey || e.metaKey) && e.keyCode === 52) {
                  e.preventDefault();
                  toast.error("Pasting not allowed!");
                }

                // Block copy (Ctrl + C)
                if ((e.ctrlKey || e.metaKey) && e.keyCode === 33) {
                  e.preventDefault();
                  toast.error("Copy not allowed!");
                }
              });
            }}
          />
        </div>
      </div>

      <div
        className="h-2 w-full cursor-row-resize"
        onMouseDown={handleMouseDown}
      />

      <div
        className="bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col overflow-hidden"
        style={{ height: `calc(${100 - topHeight}% - 8px)` }}
      >
        <div className="p-2 flex gap-2">
          <button onClick={handle_code_execute}>Run</button>
          <button onClick={handle_submit}>Submit</button>
        </div>

        <div className="p-2 text-sm">
          {stdout || stderr || "Run code to see output"}
        </div>
      </div>
    </div>
  );
}
