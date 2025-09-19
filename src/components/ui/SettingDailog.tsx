import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { textsizeAtom } from "@/context";
import type React from "react"
import { useState } from "react";
import { useSetRecoilState } from "recoil";

type AlertDialogDemoProps = {
  children: React.ReactNode;
};

export function AlertDialogDemo({children}: AlertDialogDemoProps) {
  const [menuVisiable, setmenuVisiable] = useState("hidden");
  const  setTextSize = useSetRecoilState(textsizeAtom);
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
         {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="">Are you absolutely sure?</AlertDialogTitle>     
        </AlertDialogHeader>
        <AlertDialogFooter>
          
          <AlertDialogCancel onClick={()=>menuVisiable == ""? setmenuVisiable("hidden"):null} className="bg-black">Cancel</AlertDialogCancel>
    <button onClick={()=>menuVisiable == "hidden"? setmenuVisiable(""): setmenuVisiable("hidden")} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Size<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
     </svg>
    </button>

  <div id="dropdown" className={`z-10 absolute ${menuVisiable} mt-12 bg-neutral-600 divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}>
    <ul className="py-2 text-sm text-white dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li>
        <a href="#" onClick={()=>setTextSize(15)} className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white">15px</a>
      </li>
      <li>
        <a href="#" onClick={()=>setTextSize(17)} className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white">17px</a>
      </li>
      <li> 
        <a href="#" onClick={()=>setTextSize(19)} className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white">19px</a>
      </li>
      <li>
        <a href="#" onClick={()=>setTextSize(21)} className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white">21px</a>
      </li>
    </ul>
</div>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
