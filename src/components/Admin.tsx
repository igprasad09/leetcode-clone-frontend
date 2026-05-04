import { profileEmailAtom } from "@/context";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

type DashboardDetails = {
  totalUsers: number;
  totalPrograms: number;
  totalSubmitions: number;
  allSubmitions: any[];
  allUsers: any[];
  allsubmitionsresult: any[];
  allPrograms: any[];
};

type AllProgramsType = {
  _id: string;
  active: boolean;
  title: string;
  category: string;
};

type Tab = "home" | "users" | "submissions" | "programs" | "add-program";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sum, setSum] = useState(0);

  const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails>({
    totalUsers: 0, totalPrograms: 0, totalSubmitions: 0,
    allSubmitions: [], allUsers: [], allsubmitionsresult: [], allPrograms: []
  });
  const submissions = dashboardDetails.allSubmitions || [];
  const [allPrograms, setAllPrograms] = useState<AllProgramsType[]>([]);
  const profileEmail = useRecoilValue(profileEmailAtom);

  const initialFormState = {
    title: "", 
    category: "", 
    difficulty: "Easy", 
    description: "", 
    constraints: "", 
    solutionlink: "", 
    visibility: "public", 
    tags: "",
    starterCode: { 
      javascript: "function solve(){\n  \n}", 
      python: "def solve():\n    ", 
    },
    examples: [{ input: "", output: "", explanation: "" }],
    testCases: [{ input: "", expectedOutput: "" }],
    stdio: [{ python: "solve()", javascript: "solve()" }]
  };
  
  const [form, setForm] = useState(initialFormState);
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const toggleProgram = async (title: string) => {
    await axios.post("https://backend-nine-red-85.vercel.app/admin/changeTogales", { title });
    const res = await axios.get("https://backend-nine-red-85.vercel.app/admin/allPrograms");
    setAllPrograms(res.data.allPrograms);
  };

  const deleteProgram = async (title: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`);
    if (isConfirmed) {
      try {
        await axios.post("https://backend-nine-red-85.vercel.app/admin/deleteProgram", { title });
        const res = await axios.get("https://backend-nine-red-85.vercel.app/admin/allPrograms");
        setAllPrograms(res.data.allPrograms);
      } catch (error) {
        console.error("Failed to delete program:", error);
        alert("Failed to delete program. Check console.");
      }
    }
  };

  useEffect(()=>{
        if(!profileEmail){
           navigate("/dashboard");
        }
  },[])

  const handleAddProgram = async () => {
    if (!form.title.trim() || !form.category.trim()) {
      setFormMsg("error");
      setTimeout(() => setFormMsg(null), 3000);
      return;
    }

    try {
      await axios.post("https://backend-nine-red-85.vercel.app/admin/addProgram", form);
      const res = await axios.get("https://backend-nine-red-85.vercel.app/admin/allPrograms");
      setAllPrograms(res.data.allPrograms);
      setForm(initialFormState);
      setFormMsg("success");
      setTimeout(() => setFormMsg(null), 3000);
    } catch (error) {
      console.error(error);
      setFormMsg("error");
      setTimeout(() => setFormMsg(null), 3000);
    }
  };

  const updateArrayField = (arrayName: 'examples' | 'testCases' | 'stdio', index: number, field: string, value: string) => {
    const newArray = [...form[arrayName]] as any[];
    newArray[index][field] = value;
    setForm({ ...form, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName: 'examples' | 'testCases' | 'stdio', defaultItem: any) => {
    setForm({ ...form, [arrayName]: [...form[arrayName], defaultItem] });
  };

  const removeArrayItem = (arrayName: 'examples' | 'testCases' | 'stdio', index: number) => {
    const newArray = [...form[arrayName]];
    newArray.splice(index, 1);
    setForm({ ...form, [arrayName]: newArray });
  };

  const nav: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Dashboard", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: "users", label: "User Directory", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { id: "submissions", label: "Submissions", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: "programs", label: "Active Programs", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: "add-program", label: "Create Program", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> },
  ];

  useEffect(() => {
    async function callBackend() {
      try {
        const dashRes = await axios("https://backend-nine-red-85.vercel.app/admin/dashboardDetails");
        setDashboardDetails(dashRes.data);
        const progRes = await axios.get("https://backend-nine-red-85.vercel.app/admin/allPrograms");
        setAllPrograms(progRes.data.allPrograms);
      } catch (err) {
        console.error("Failed to load dashboard details", err);
      }
    }
    callBackend();
  }, [])

  useEffect(() => {
    setSum(submitionCount.reduce((acc, sub) => acc + sub.programCount, 0));
  }, [submissions]);
  
  const allusers = dashboardDetails.allUsers || [];
  const submitionCount = dashboardDetails.allsubmitionsresult || [];
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-300 overflow-hidden font-sans selection:bg-zinc-700">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-500 ease-out flex-shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900 z-20`}>
        <div className="h-14 flex items-center px-4 border-b border-zinc-800 gap-3">
          <div onClick={() => navigate("/dashboard")} className="w-8 h-8 rounded bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-sm flex-shrink-0 cursor-pointer hover:bg-zinc-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg">
            A
          </div>
          <span onClick={() => navigate("/dashboard")} className={`font-semibold cursor-pointer text-zinc-200 whitespace-nowrap transition-all duration-300 overflow-hidden ${sidebarOpen ? "opacity-100 w-auto translate-x-0" : "opacity-0 w-0 -translate-x-4"}`}>
            Prepcode <span className="text-zinc-500 font-normal">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto custom-scrollbar">
          {nav.map((item, i) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              style={{ animationDelay: `${i * 0.05}s` }}
              className={`animate-slide-right opacity-0 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id ? "text-zinc-100 bg-zinc-800 shadow-md scale-[1.02]" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 hover:translate-x-1 active:scale-95"}`}
            >
              <span className={`flex-shrink-0 transition-colors duration-300 ${activeTab === item.id ? "text-zinc-200" : "text-zinc-500"}`}>{item.icon}</span>
              <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-2 border-t border-zinc-800">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full py-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all duration-200 flex justify-center items-center">
            <svg className={`w-5 h-5 transition-transform duration-500 ${sidebarOpen ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-zinc-950">
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
          <h1 className="font-semibold text-zinc-100 text-lg animate-fade-in">{nav.find((n) => n.id === activeTab)?.label}</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">

          {/* ── HOME ── */}
          {activeTab === "home" && (
            <div className="space-y-6 max-w-6xl mx-auto w-full animate-fade-in">
              <h2 className="text-2xl font-bold text-zinc-100 animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up opacity-0" style={{ animationDelay: "0.2s" }}>
                   <p className="text-zinc-400 text-sm font-medium">Total Users</p>
                   <p className="text-3xl font-bold mt-2 text-zinc-100">{dashboardDetails.totalUsers}</p>
                 </div>
                 <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up opacity-0" style={{ animationDelay: "0.3s" }}>
                   <p className="text-zinc-400 text-sm font-medium">Total Submissions</p>
                   <p className="text-3xl font-bold mt-2 text-zinc-100">{sum}</p>
                 </div>
                 <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up opacity-0" style={{ animationDelay: "0.4s" }}>
                   <p className="text-zinc-400 text-sm font-medium">Total Programs</p>
                   <p className="text-3xl font-bold mt-2 text-zinc-100">{dashboardDetails.totalPrograms}</p>
                 </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === "users" && (
            <div className="space-y-4 max-w-6xl mx-auto w-full animate-fade-in">
              <h2 className="text-xl font-bold text-zinc-100 animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>User Directory <span className="text-zinc-500 font-normal text-base ml-2">({allusers.length})</span></h2>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm animate-slide-up opacity-0" style={{ animationDelay: "0.2s" }}>
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-zinc-800 bg-zinc-950/50 text-zinc-400 font-medium">
                    <tr><th className="px-6 py-3">User Identifier</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {allusers.map((u, i) => (
                      <tr key={u._id || i} className="hover:bg-zinc-800/30 hover:pl-2 transition-all duration-200 animate-slide-up opacity-0" style={{ animationDelay: `${(i * 0.05) + 0.3}s` }}>
                        <td className="px-6 py-4 text-zinc-300">{u.username} <span className="text-zinc-500 ml-2">({u.email})</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SUBMISSIONS ── */}
          {activeTab === "submissions" && (
            <div className="space-y-4 max-w-6xl mx-auto w-full animate-fade-in">
              <h2 className="text-xl font-bold text-zinc-100 animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>Applications Log</h2>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm animate-slide-up opacity-0" style={{ animationDelay: "0.2s" }}>
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-zinc-800 bg-zinc-950/50 text-zinc-400 font-medium">
                    <tr>
                      <th className="px-6 py-3">User ID</th>
                      <th className="px-6 py-3">Problems Attempted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {submitionCount.map((s, i) => (
                      <tr key={s.userId || i} className="hover:bg-zinc-800/30 hover:pl-2 transition-all duration-200 animate-slide-up opacity-0" style={{ animationDelay: `${(i * 0.05) + 0.3}s` }}>
                        <td className="px-6 py-4 text-zinc-300 font-mono text-xs">{s.userId}</td>
                        <td className="px-6 py-4 text-zinc-300 font-semibold">{s.programCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PROGRAMS ── */}
          {activeTab === "programs" && (
            <div className="space-y-4 max-w-6xl mx-auto w-full animate-fade-in">
              <div className="flex items-center justify-between animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">Active Programs</h2>
                  <p className="text-zinc-500 text-sm mt-1">{allPrograms.length} total programs configured</p>
                </div>
              </div>
              <div className="grid gap-3">
                {allPrograms.map((program, i) => (
                  <div key={program._id || i} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between hover:bg-zinc-800/50 hover:shadow-lg hover:border-zinc-700 transition-all duration-300 animate-slide-up opacity-0" style={{ animationDelay: `${(i * 0.05) + 0.2}s` }}>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded border border-zinc-700 bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 shadow-inner">
                        {program.title ? program.title[0] : "P"}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-200">{program.title ? program.title.replace(/^\d+\.\s*/, "") : "Unknown"}</p>
                        <p className="text-zinc-500 text-xs mt-1">{program.category || "Uncategorized"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded hidden sm:block transition-colors duration-500 ${program.active ? "bg-green-500/10 text-green-500" : "bg-zinc-800 text-zinc-500"}`}>
                        {program.active ? "Active" : "Draft"}
                      </span>
                      
                      {/* Toggle Switch */}
                      <button onClick={() => toggleProgram(program.title)} className={`w-11 h-6 rounded-full relative transition-colors duration-300 hover:scale-105 active:scale-95 ${program.active ? "bg-green-500" : "bg-zinc-700"}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${program.active ? "left-6" : "left-1"}`} />
                      </button>
                      
                      {/* Delete Button */}
                      <button onClick={() => deleteProgram(program.title)} title="Delete Program" className="w-8 h-8 rounded text-zinc-500 hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center active:scale-90 transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FULL ADD PROGRAM FORM ── */}
          {activeTab === "add-program" && (
            <div className="max-w-4xl mx-auto w-full pb-10 animate-fade-in">
              <div className="mb-6 animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>
                <h2 className="text-2xl font-bold text-zinc-100">Create Problem</h2>
                <p className="text-sm text-zinc-500 mt-1">Add a new challenge to the platform.</p>
              </div>

              <div className="rounded-lg bg-zinc-900 border border-zinc-800 shadow-sm overflow-hidden animate-slide-up opacity-0" style={{ animationDelay: "0.2s" }}>
                <div className="p-6 space-y-6">
                  
                  {/* Row 1: Basic Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up opacity-0" style={{ animationDelay: "0.3s" }}>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Problem Title</label>
                      <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Two Sum" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none transition-all duration-200" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Category</label>
                      <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Arrays & Hashing" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none transition-all duration-200" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Difficulty</label>
                      <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none transition-all duration-200 appearance-none">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Solution Link (YouTube URL)</label>
                      <input type="text" value={form.solutionlink} onChange={(e) => setForm({ ...form, solutionlink: e.target.value })} placeholder="https://youtu.be/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none transition-all duration-200" />
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-1.5 animate-slide-up opacity-0" style={{ animationDelay: "0.4s" }}>
                    <label className="text-xs font-medium text-zinc-400">Problem Description</label>
                    <textarea 
                      value={form.description} 
                      onChange={(e) => setForm({ ...form, description: e.target.value })} 
                      placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..." 
                      rows={5}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none transition-all duration-200 custom-scrollbar" 
                    />
                  </div>

                  {/* Constraints Section */}
                  <div className="space-y-1.5 animate-slide-up opacity-0" style={{ animationDelay: "0.5s" }}>
                    <label className="text-xs font-medium text-zinc-400">Constraints (One per line)</label>
                    <textarea 
                      value={form.constraints} 
                      onChange={(e) => setForm({ ...form, constraints: e.target.value })} 
                      placeholder="2 <= nums.length <= 10^4&#10;-10^9 <= nums[i] <= 10^9" 
                      rows={3}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 font-mono focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none transition-all duration-200 custom-scrollbar" 
                    />
                  </div>

                  {/* Starter Code Section */}
                  <div className="pt-2 animate-slide-up opacity-0" style={{ animationDelay: "0.6s" }}>
                    <h3 className="text-sm font-semibold text-zinc-200 mb-3">Starter Code</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['javascript', 'python'].map((lang) => (
                        <div key={lang} className="space-y-1.5 group">
                          <label className="text-[11px] font-mono text-zinc-500 uppercase group-hover:text-zinc-300 transition-colors">{lang}</label>
                          <textarea
                            value={(form.starterCode as any)[lang]}
                            onChange={(e) => setForm({ ...form, starterCode: { ...form.starterCode, [lang]: e.target.value } })}
                            rows={4}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-300 font-mono focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none transition-all duration-200 custom-scrollbar"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-zinc-800" />

                  {/* Examples Section */}
                  <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.7s" }}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-zinc-200">Visible Examples</h3>
                      <button onClick={() => addArrayItem('examples', { input: '', output: '', explanation: '' })} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded text-xs font-medium text-zinc-300 transition-all duration-200">+ Add Example</button>
                    </div>
                    <div className="space-y-3">
                      {form.examples.map((ex, i) => (
                        <div key={i} className="flex gap-3 p-3 border border-zinc-800 rounded-md bg-zinc-950/50 animate-fade-scale opacity-0" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className="flex-1 space-y-2">
                            <input type="text" placeholder="Input (e.g., nums = [2,7,11,15], target = 9)" value={ex.input} onChange={(e) => updateArrayField('examples', i, 'input', e.target.value)} className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm text-zinc-300 font-mono focus:border-zinc-500 outline-none transition-colors" />
                            <input type="text" placeholder="Output (e.g., [0,1])" value={ex.output} onChange={(e) => updateArrayField('examples', i, 'output', e.target.value)} className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm text-zinc-300 font-mono focus:border-zinc-500 outline-none transition-colors" />
                            <input type="text" placeholder="Explanation (Optional)" value={ex.explanation} onChange={(e) => updateArrayField('examples', i, 'explanation', e.target.value)} className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm text-zinc-400 focus:border-zinc-500 outline-none transition-colors" />
                          </div>
                          <button onClick={() => removeArrayItem('examples', i)} className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded p-1 self-start active:scale-90 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-zinc-800" />

                  {/* Test Cases Section */}
                  <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.8s" }}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-zinc-200">Hidden Test Cases</h3>
                      <button onClick={() => addArrayItem('testCases', { input: '', expectedOutput: '' })} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded text-xs font-medium text-zinc-300 transition-all duration-200">+ Add Test Case</button>
                    </div>
                    <div className="space-y-3">
                      {form.testCases.map((tc, i) => (
                        <div key={i} className="flex gap-3 p-3 border border-zinc-800 rounded-md bg-zinc-950/50 items-start animate-fade-scale opacity-0" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input type="text" placeholder="Raw Input" value={tc.input} onChange={(e) => updateArrayField('testCases', i, 'input', e.target.value)} className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm text-zinc-300 font-mono focus:border-zinc-500 outline-none transition-colors" />
                            <input type="text" placeholder="Expected Output" value={tc.expectedOutput} onChange={(e) => updateArrayField('testCases', i, 'expectedOutput', e.target.value)} className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm text-zinc-300 font-mono focus:border-zinc-500 outline-none transition-colors" />
                          </div>
                          <button onClick={() => removeArrayItem('testCases', i)} className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded p-1 active:scale-90 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-zinc-800" />

                  {/* StdIO Execution Maps Section */}
                  <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-md animate-slide-up opacity-0" style={{ animationDelay: "0.9s" }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-200">StdIO Execution Maps <span className="text-red-500">*</span></h3>
                        <p className="text-xs text-zinc-500 mt-1">Maps backend runner files to problem structure. Ensure solve() is triggered.</p>
                      </div>
                      <button onClick={() => addArrayItem('stdio', { python: 'solve()', javascript: 'solve()' })} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded text-xs font-medium text-zinc-300 transition-all duration-200 whitespace-nowrap">+ Add Map</button>
                    </div>
                    <div className="space-y-3">
                      {form.stdio.map((st, i) => (
                        <div key={i} className="flex gap-3 p-3 border border-zinc-800 rounded-md bg-zinc-900 animate-fade-scale opacity-0" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {['python', 'javascript'].map(lang => (
                              <div key={lang}>
                                <label className="text-[10px] text-zinc-500 font-mono uppercase">{lang}</label>
                                <input 
                                  type="text" 
                                  placeholder={lang === 'python' || lang === 'javascript' ? "solve()" : ""} 
                                  value={(st as any)[lang]} 
                                  onChange={(e) => updateArrayField('stdio', i, lang, e.target.value)} 
                                  className="w-full bg-transparent border-b border-zinc-800 pb-1 mt-1 text-xs text-zinc-300 font-mono outline-none focus:border-zinc-500 transition-colors" 
                                />
                              </div>
                            ))}
                          </div>
                          <button onClick={() => removeArrayItem('stdio', i)} className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded p-1 self-center active:scale-90 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
                
                {/* Submit Area Footer */}
                <div className="p-6 bg-zinc-950/50 border-t border-zinc-800">
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${formMsg ? "max-h-20 mb-4 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}>
                    {formMsg === "success" && <div className="rounded border border-green-500/20 bg-green-500/10 text-green-500 px-4 py-3 text-sm font-medium">Problem published successfully!</div>}
                    {formMsg === "error" && <div className="rounded border border-red-500/20 bg-red-500/10 text-red-500 px-4 py-3 text-sm font-medium">Title and Category are required.</div>}
                  </div>

                  <button onClick={handleAddProgram} className="w-full py-2.5 rounded bg-zinc-200 text-zinc-900 font-bold hover:bg-white active:scale-[0.98] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200 text-sm">
                    Publish Problem
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Global Styles & Keyframes ── */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-slide-up {
          animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-fade-scale {
          animation: fadeScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-right {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}