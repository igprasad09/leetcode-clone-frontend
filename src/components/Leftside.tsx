import { programInfoAtom } from "@/context"
import { useRecoilValue } from "recoil"

export default function Leftside() {
  const programInfo = useRecoilValue(programInfoAtom);

  if(!programInfo){
       return <div>Loading.....</div>
  }

  return (
    <div className=" text-white">
          <div className="bg-zinc-900">
               <button className="text-sm bg-zinc-800 p-2 mt-2 rounded-t-sm">Description</button>
          </div>
          <div className="m-5">
               <p className="text-md font-semibold">{programInfo.title}</p>

               <span className="flex items-center mt-4">
                    <button className="text-[12px] bg-slate-600 p-1 rounded-sm px-3 text-teal-500">{programInfo.difficulty}</button>
                  
                    <button className="cursor-pointer items-center text-zinc-400 ml-5 flex"><svg className="size-5 mr-1 text-zinc-500" xmlns="http://www.w3.org/2000/svg"width="24"height="24"viewBox="0 0 24 24"fill="currentColor"><path d="M2 21h4V9H2v12zM22 9c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L12.17 1 6.59 6.59C6.21 6.95 6 7.45 6 8v11c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V9z" /></svg>
                        {programInfo.like}</button>

                    <button className="flex items-center text-zinc-400">
                       <svg className="text-zinc-500 size-5 ml-3 mr-1" xmlns="http://www.w3.org/2000/svg"width="24"height="24"viewBox="0 0 24 24"fill="currentColor"><path d="M22 3H18v12h4V3zM2 15c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L11.83 23l5.59-5.59C17.79 17.05 18 16.55 18 16V5c0-1.1-.9-2-2-2H7C6.17 3 5.46 3.5 5.16 4.22L2.14 11.27c-.09.23-.14.47-.14.73V15z" /></svg>
                    {programInfo.dislike}</button>
               </span>

               <p className="mt-3 text-sm italic">{programInfo.description}</p>
               
               {programInfo.examples.map((element:{ input: string; output: string; explanation: string }, index: number)=>(
                     <div key={index}>
                      <h1 className="font-semibold mt-5 mb-5">Example: {index+1}</h1>
               <div className="bg-neutral-700 font-mono rounded-sm p-2 font-semibold">
                    <p className="flex items-center">Input: <span className="ml-2 text-stone-300 text-sm font-mono">{element.input}</span> </p>
                   <p className="flex items-center">Output: <span className="ml-2 text-stone-300 text-sm font-mono">{element.output}</span> </p>
                   <p className="flex items-center">Explation: <span className="ml-2 text-stone-300 text-sm font-mono">{element.explanation}</span> </p>  
               </div>
                     </div>
               ))}

             <h1 className="font-semibold mt-5 mb-5">Constraints:</h1>

             <ul className="list-disc list-inside">
               {programInfo.constraints.map((element: string, index: number)=>(
                 <li className="" key={index}><span className="bg-neutral-700 px-3 rounded-sm border border-neutral-600 text-slate-300">{element}</span></li>
             ))}
             </ul>

          </div>

    </div>
  )
}
