import { programInfoAtom } from "@/context";
import { useRecoilValue } from "recoil";
import LikeButton from "./ui/LikeButton";

export default function Leftside() {
  const programInfo = useRecoilValue(programInfoAtom);

  if (!programInfo) {
    return (
      <div className="p-6 space-y-6 h-full w-full">
        <div className="h-8 w-1/3 bg-zinc-800 rounded animate-pulse"></div>
        <div className="flex space-x-3">
          <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-6 w-16 bg-zinc-800 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-900 overflow-hidden">
      {/* Top Header / Tab */}
      <div className="bg-zinc-900 border-b border-zinc-800 flex items-end px-2 pt-2">
        <div className="px-4 py-2 text-sm font-medium text-white bg-zinc-800/80 rounded-t-md flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
          Description
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide text-zinc-300">
        <h1 className="text-2xl font-bold text-white mb-4">{programInfo.title}</h1>

        {/* Difficulty and Meta info */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-semibold tracking-wide bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full">
            {programInfo.difficulty}
          </span>
          <div className="flex items-center text-sm text-zinc-400">
            <LikeButton totalLikes={11} />
          </div>
        </div>

        {/* Description Text */}
        <div className="text-[15px] leading-relaxed mb-8 whitespace-pre-wrap text-zinc-300">
          {programInfo.description}
        </div>

        {/* Examples */}
        <div className="space-y-6">
          {programInfo.examples.map((element: { input: string; output: string; explanation: string }, index: number) => (
            <div key={index} className="space-y-2">
              <h2 className="text-sm font-bold text-white">Example {index + 1}:</h2>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-sm space-y-2">
                <div className="flex items-start">
                  <span className="text-zinc-500 font-semibold w-24 shrink-0">Input:</span>
                  <span className="text-zinc-300 break-all">{element.input}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-zinc-500 font-semibold w-24 shrink-0">Output:</span>
                  <span className="text-zinc-300 break-all">{element.output}</span>
                </div>
                {element.explanation && (
                  <div className="flex items-start pt-2 mt-2 border-t border-zinc-800/50">
                    <span className="text-zinc-500 font-semibold w-24 shrink-0">Explanation:</span>
                    <span className="text-zinc-400 font-sans">{element.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="mt-8">
          <h2 className="text-sm font-bold text-white mb-3">Constraints:</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm marker:text-zinc-600">
            {programInfo.constraints.map((element: string, index: number) => (
              <li key={index} className="pl-1">
                <code className="bg-zinc-800/80 text-zinc-200 px-1.5 py-0.5 rounded font-mono text-[13px] border border-zinc-700/50">
                  {element}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 