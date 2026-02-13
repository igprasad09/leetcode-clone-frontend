import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import Navbar from "./Navbar";
import { BackgroundLines } from "./ui/background-lines";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import { profileEmailAtom } from "@/context";
import axios from "axios";
import FeaturesSectionDemo from "./features-section-demo-3";
import FeedbackList from "./ui/Feedbacktable";
import { useEffect, useState } from "react";
import { Button } from "./ui/stateful-button";

export default function Contactus() {
    const testimonials = [
  {
    quote: "MERN Stack Developer | React & Node.js | DSA Enthusiast | 2× Coding Competition Winner at SNJPSNMS College | Runner-Up at Engineering College",
    name: "Prasad Kamble",
    designation: "Backend Developer",
    src: "/user1.jpeg",
  },
  {
    quote: "React Developer | Python Programmer | Runner-Up in Engineering College Coding Competition",
    name: "Sameer Sayyad",
    designation: "Frontend Developer",
    src: "/user2.jpg",
  },
];
  const placeholders = [
  "Search coding problems...",
  "Find DSA questions...",
  "Search by difficulty...",
  "Search by topic..."
];
const words = [
  "Practice DSA Problems",
  "Compete on Leaderboards",
  "Run Code in Real-Time",
  "Prepare for Top Tech Jobs",
  "Level Up Your Coding Skills"
];

  const email = useRecoilValue(profileEmailAtom);
  const [allfeedbackdata, setallfeedbackdata] = useState([]);
  
  async function handle_feedbacks(email:string, feedback:string){
      await axios.post("http://backend-nine-red-85.vercel.app/programs/feedback", 
            {email,
            feedback}
      ).then((res)=> console.log(res.data))
  }

  useEffect(()=>{
      async function fetchallfeedback(){
           await axios.get("http://backend-nine-red-85.vercel.app/programs/allfeedbacks").then((res)=>{
                    setallfeedbackdata(res.data.allfeedbacks)
           })
      }
      fetchallfeedback();
  },[])

  const handleClick = () => {
    async function fetchallfeedback(){
           await axios.get("http://backend-nine-red-85.vercel.app/programs/allfeedbacks").then((res)=>{
                    setallfeedbackdata(res.data.allfeedbacks)
           })
      }
     fetchallfeedback();
    return new Promise((resolve) => {
      setTimeout(resolve);
    });
  };

  return (
    <div className="w-full h-screen bg-black">
       <BackgroundLines>
          <Navbar/>   
          <div className="flex justify-center m-5 -mb-8">
            <LayoutTextFlip
        text="Prepcode =>"
        words={words}
        duration={2000} // optional
      />
          </div>
      <AnimatedTestimonials testimonials={testimonials} />
      <p className="text-center -mt-6 text-md">Give Feedback👇</p>
            <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={() => null}
          onSubmit={(e) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const feedback = (form.elements.namedItem("feedback") as HTMLInputElement).value;

        handle_feedbacks(email, feedback)
        toast.success("Thank You For Feedback 😊");
      }}
    /> 
        
        <FeaturesSectionDemo/>
         <div className="flex justify-center"><Button onClick={handleClick} children="Refresh Feedbacks"/></div>
         <FeedbackList feedbacks={allfeedbackdata}/>
       </BackgroundLines> 
      
    </div>
  )
}
