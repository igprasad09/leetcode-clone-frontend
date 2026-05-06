import { profileEmailAtom } from "@/context";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { motion, AnimatePresence, type Variants, animate, useMotionValue, useTransform } from "framer-motion";

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


// --- Number Animation Component ---
const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { 
      duration: 1.5, // How long the counting takes (1.5 seconds)
      ease: "easeOut" // Slows down nicely at the end
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};


// --- Custom Native SVG Charts with Advanced Animations ---

const CustomAreaChart = ({ data }: { data: { name: string, submissions: number }[] }) => {
  if (!data || data.length === 0) return <div className="text-zinc-600 text-sm flex h-full items-center justify-center">Waiting for data...</div>;

  const height = 250;
  const width = 800;
  const paddingX = 40;
  const paddingY = 20;
  
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  
  const maxValue = Math.max(...data.map(d => d.submissions)) || 1;
  const stepX = chartWidth / (data.length > 1 ? data.length - 1 : 1);

  const points = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = height - paddingY - (d.submissions / maxValue) * chartHeight;
    return { x, y, label: d.name, value: d.submissions };
  });

  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-zinc-400 overflow-visible">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
        </linearGradient>
      </defs>

      {/* Grid Lines */}
      {[0, 0.5, 1].map(ratio => (
        <line key={ratio} x1={paddingX} y1={paddingY + chartHeight * ratio} x2={width - paddingX} y2={paddingY + chartHeight * ratio} stroke="#27272a" strokeDasharray="3 3" />
      ))}

      {/* Animated Filled Area */}
      <motion.path 
        initial={{ opacity: 0, d: areaPath }}
        animate={{ opacity: 1, d: areaPath }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        fill="url(#areaGradient)" 
      />
      
      {/* Animated Line (Draws itself in, then smoothly updates path changes) */}
      <motion.path 
        initial={{ pathLength: 0, d: linePath }}
        animate={{ pathLength: 1, d: linePath }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        fill="none" 
        stroke="#8b5cf6" 
        strokeWidth="3" 
      />

      {/* Animated Data Points */}
      {points.map((p, i) => (
        <g key={p.label} className="group cursor-pointer">
          <motion.circle 
            initial={{ scale: 0, cx: p.x, cy: height - paddingY }}
            animate={{ scale: 1, cx: p.x, cy: p.y }}
            transition={{ type: "spring", delay: 0.5 + (i * 0.05), stiffness: 300, damping: 20 }}
            r="5" 
            fill="#18181b" 
            stroke="#c4b5fd" 
            strokeWidth="2" 
            className="transition-all duration-200 group-hover:r-6 group-hover:stroke-white" 
          />
          <text x={p.x} y={height} fontSize="12" fill="currentColor" textAnchor="middle">{p.label}</text>
          
          {/* Tooltip */}
          <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <rect x={p.x - 40} y={p.y - 45} width="80" height="30" fill="#18181b" stroke="#27272a" rx="4" />
            <text x={p.x} y={p.y - 25} fontSize="12" fill="#e4e4e7" textAnchor="middle" fontWeight="bold">
              {p.value} Solved
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
};

const CustomBarChart = ({ data }: { data: { name: string, count: number }[] }) => {
  if (!data || data.length === 0) return <div className="text-zinc-600 text-sm flex h-full items-center justify-center">Waiting for data...</div>;

  const height = 250;
  const width = 400;
  const paddingX = 90; 
  const paddingY = 20;
  const chartWidth = width - paddingX - 40;
  const chartHeight = height - paddingY * 2;
  
  const maxValue = Math.max(...data.map(d => d.count)) || 1;
  const barHeight = Math.min(24, chartHeight / data.length - 8); 
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-zinc-400">
      {/* Grid Lines */}
      {[0, 0.5, 1].map(ratio => {
        const x = paddingX + chartWidth * ratio;
        return <line key={ratio} x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke="#27272a" strokeDasharray="3 3" />;
      })}

      {data.map((d, i) => {
        const barWidth = (d.count / maxValue) * chartWidth;
        const yOffset = paddingY + i * (chartHeight / data.length) + (chartHeight / data.length - barHeight) / 2;
        
        return (
          <g key={d.name} className="group cursor-pointer">
            <text x={paddingX - 10} y={yOffset + barHeight / 2 + 4} fontSize="11" fill="currentColor" textAnchor="end">
              {d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name}
            </text>
            
            {/* Animated Bar Width */}
            <motion.rect 
              x={paddingX} 
              y={yOffset} 
              height={barHeight} 
              fill={colors[i % colors.length]} 
              rx="4" 
              className="transition-all duration-300 group-hover:brightness-125"
              initial={{ width: 0 }}
              animate={{ width: barWidth }}
              transition={{ type: "spring", delay: i * 0.1, stiffness: 200, damping: 20 }}
            />
            
            {/* Animated Data Label Value Position */}
            <motion.text 
              initial={{ x: paddingX, opacity: 0 }}
              animate={{ x: paddingX + barWidth + 8, opacity: 1 }}
              transition={{ type: "spring", delay: i * 0.1, stiffness: 200, damping: 20 }}
              y={yOffset + barHeight / 2 + 4} 
              fontSize="12" 
              fill="#e4e4e7" 
              fontWeight="bold" 
            >
              {d.count}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
};

// --- Framer Motion Variants ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const pageVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};


// --- Main Admin Component ---

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
  const navigate = useNavigate();

  const initialFormState = {
    title: "", category: "", difficulty: "Easy", description: "", constraints: "", 
    solutionlink: "", visibility: "public", tags: "",
    starterCode: { javascript: "function solve(){\n  \n}", python: "def solve():\n    " },
    examples: [{ input: "", output: "", explanation: "" }],
    testCases: [{ input: "", expectedOutput: "" }],
    stdio: [{ python: "solve()", javascript: "solve()" }]
  };
  
  const [form, setForm] = useState(initialFormState);
  const [formMsg, setFormMsg] = useState<string | null>(null);

  // --- Real Data Processing for Charts ---
  const topUsersData = useMemo(() => {
    if (!dashboardDetails.allsubmitionsresult || !dashboardDetails.allUsers) return [];
    return dashboardDetails.allsubmitionsresult
      .map(sub => {
        const user = dashboardDetails.allUsers.find(u => u._id === sub.userId);
        return {
          name: user?.username || sub.userId.substring(0, 6) + '...',
          submissions: sub.programCount
        };
      })
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 10);
  }, [dashboardDetails.allsubmitionsresult, dashboardDetails.allUsers]);

  const categoryData = useMemo(() => {
    if (!allPrograms.length) return [];
    const counts = allPrograms.reduce((acc, curr) => {
      const cat = curr.category ? curr.category.trim() : "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allPrograms]);

  // --- CRUD Functions ---
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

  // --- Form Array Helpers ---
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

  // --- Navigation Data ---
  const nav: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Dashboard", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: "users", label: "User Directory", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { id: "submissions", label: "Submissions", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: "programs", label: "Active Programs", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: "add-program", label: "Create Program", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> },
  ];

  // --- Effects ---
  useEffect(() => {
    if(!profileEmail){
        navigate("/dashboard");
    }
  }, [profileEmail, navigate]);

  useEffect(() => {
    async function callBackend() {
      try {
        const dashRes = await axios.get("https://backend-nine-red-85.vercel.app/admin/dashboardDetails");
        setDashboardDetails(dashRes.data);
        const progRes = await axios.get("https://backend-nine-red-85.vercel.app/admin/allPrograms");
        setAllPrograms(progRes.data.allPrograms);
      } catch (err) {
        console.error("Failed to load dashboard details", err);
      }
    }
    callBackend();
  }, []);

  useEffect(() => {
    setSum(submitionCount.reduce((acc, sub) => acc + sub.programCount, 0));
  }, [submissions]);
  
  const allusers = dashboardDetails.allUsers || [];
  const submitionCount = dashboardDetails.allsubmitionsresult || [];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-300 overflow-hidden font-sans selection:bg-zinc-700">

      {/* ── Sidebar ── */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 64 }}
        className="flex-shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-md z-20"
      >
        <div className="h-14 flex items-center px-4 border-b border-zinc-800 gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")} 
            className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            A
          </motion.div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => navigate("/dashboard")} 
                className="font-semibold cursor-pointer text-zinc-200 whitespace-nowrap"
              >
                Prepcode <span className="text-zinc-500 font-normal">Admin</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-2 px-2 overflow-y-auto custom-scrollbar">
          {nav.map((item, i) => (
            <motion.button 
              key={item.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveTab(item.id)} 
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === item.id ? "text-zinc-100 bg-zinc-800 shadow-md" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"}`}
            >
              {activeTab === item.id && (
                <motion.div layoutId="activeTabIndicator" className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />
              )}
              <span className={`flex-shrink-0 z-10 ${activeTab === item.id ? "text-indigo-400" : "text-zinc-500"}`}>{item.icon}</span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden z-10"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </nav>
        
        <div className="p-2 border-t border-zinc-800">
          <motion.button 
            whileHover={{ backgroundColor: "rgba(39, 39, 42, 1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="w-full py-2 rounded-lg text-zinc-500 hover:text-zinc-300 flex justify-center items-center"
          >
            <motion.svg 
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </motion.svg>
          </motion.button>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-zinc-950/50">
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
          <motion.h1 
            key={activeTab}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-semibold text-zinc-100 text-lg"
          >
            {nav.find((n) => n.id === activeTab)?.label}
          </motion.h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-6xl mx-auto"
            >
              
              {/* ── HOME ── */}
              {activeTab === "home" && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                  
                  {/* Stats Row with Animated Numbers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {[
                       { label: "Total Users", value: dashboardDetails.totalUsers, color: "from-blue-500/20 to-blue-500/0", border: "border-blue-500/30" },
                       { label: "Total Submissions", value: sum, color: "from-purple-500/20 to-purple-500/0", border: "border-purple-500/30" },
                       { label: "Total Programs", value: dashboardDetails.totalPrograms, color: "from-green-500/20 to-green-500/0", border: "border-green-500/30" }
                     ].map((stat, i) => (
                       <motion.div 
                         key={i}
                         variants={itemVariants}
                         whileHover={{ y: -5, scale: 1.02 }}
                         className={`rounded-xl bg-zinc-900 border ${stat.border} p-5 shadow-lg relative overflow-hidden group`}
                       >
                         <div className={`absolute inset-0 bg-gradient-to-b ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                         <p className="text-zinc-400 text-sm font-medium relative z-10">{stat.label}</p>
                         <motion.p 
                           initial={{ scale: 0.5, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ delay: 0.2 + (i * 0.1), type: "spring" }}
                           className="text-4xl font-bold mt-2 text-zinc-100 relative z-10"
                         >
                           {/* This is the new animated counter */}
                           <AnimatedCounter value={stat.value} /> 
                         </motion.p>
                       </motion.div>
                     ))}
                  </div>

                  {/* NATIVE SVG CHARTS (No Libraries) */}
                  <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    
                    {/* Top Users Chart */}
                    <div className="lg:col-span-2 rounded-xl bg-zinc-900 border border-zinc-800 p-5 shadow-lg">
                      <h3 className="text-zinc-200 font-semibold mb-1">Top Active Users</h3>
                      <p className="text-zinc-500 text-xs mb-4">Highest number of solved problems.</p>
                      
                      <div className="h-72 w-full">
                         <CustomAreaChart data={topUsersData} />
                      </div>
                    </div>

                    {/* Category Distribution Chart */}
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 shadow-lg">
                      <h3 className="text-zinc-200 font-semibold mb-1">Programs by Category</h3>
                      <p className="text-zinc-500 text-xs mb-4">Distribution of problems.</p>

                      <div className="h-72 w-full">
                         <CustomBarChart data={categoryData} />
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              )}

              {/* ── USERS ── */}
              {activeTab === "users" && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                  <motion.h2 variants={itemVariants} className="text-xl font-bold text-zinc-100">
                    User Directory <span className="text-indigo-400 font-normal text-base ml-2 bg-indigo-500/10 px-2 py-0.5 rounded-full">{allusers.length} Total</span>
                  </motion.h2>
                  <motion.div variants={itemVariants} className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 font-medium">
                        <tr><th className="px-6 py-4">User Identifier</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {allusers.map((u, i) => (
                          <motion.tr 
                            key={u._id || i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.5)", paddingLeft: "8px" }}
                            className="transition-colors cursor-default"
                          >
                            <td className="px-6 py-4 text-zinc-300 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                                {u.username ? u.username[0].toUpperCase() : "?"}
                              </div>
                              <div>
                                <p className="font-medium">{u.username}</p>
                                <p className="text-zinc-500 text-xs">{u.email}</p>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                </motion.div>
              )}

              {/* ── SUBMISSIONS ── */}
              {activeTab === "submissions" && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                  <motion.h2 variants={itemVariants} className="text-xl font-bold text-zinc-100">Applications Log</motion.h2>
                  <motion.div variants={itemVariants} className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 font-medium">
                        <tr>
                          <th className="px-6 py-4">User ID</th>
                          <th className="px-6 py-4 text-right">Problems Attempted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {submitionCount.map((s, i) => (
                          <motion.tr 
                            key={s.userId || i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.5)" }}
                          >
                            <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{s.userId}</td>
                            <td className="px-6 py-4 text-zinc-100 font-semibold text-right">
                              <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full">
                                {s.programCount}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                </motion.div>
              )}

              {/* ── PROGRAMS ── */}
              {activeTab === "programs" && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                  <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-100">Active Programs</h2>
                      <p className="text-zinc-500 text-sm mt-1">{allPrograms.length} total programs configured</p>
                    </div>
                  </motion.div>
                  <motion.div className="grid gap-4" layout>
                    <AnimatePresence>
                      {allPrograms.map((program, i) => (
                        <motion.div 
                          layout
                          key={program._id || program.title} 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ y: -2, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
                          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg border border-zinc-700/50 bg-zinc-800/50 flex items-center justify-center font-bold text-zinc-300 shadow-inner group-hover:bg-zinc-700 transition-colors">
                              {program.title ? program.title[0] : "P"}
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-200 text-lg">{program.title ? program.title.replace(/^\d+\.\s*/, "") : "Unknown"}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-zinc-500 text-xs px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700">{program.category || "Uncategorized"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-5">
                            {/* Toggle Switch */}
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleProgram(program.title)} 
                              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${program.active ? "bg-green-500" : "bg-zinc-700"}`}
                            >
                              <motion.span 
                                layout
                                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" 
                                animate={{ left: program.active ? "28px" : "4px" }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </motion.button>
                            
                            {/* Delete Button */}
                            <motion.button 
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)", color: "rgb(239, 68, 68)" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteProgram(program.title)} 
                              title="Delete Program" 
                              className="w-9 h-9 rounded-lg text-zinc-500 flex items-center justify-center transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              {/* ── FULL ADD PROGRAM FORM ── */}
              {activeTab === "add-program" && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto w-full pb-10">
                  <motion.div variants={itemVariants} className="mb-6">
                    <h2 className="text-2xl font-bold text-zinc-100">Create Problem</h2>
                    <p className="text-sm text-zinc-500 mt-1">Add a new coding challenge to PrepCode.</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
                    <div className="p-6 space-y-8">
                      
                      {/* Row 1: Basic Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Problem Title</label>
                          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Two Sum" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-300" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Category</label>
                          <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Arrays & Hashing" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-300" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Difficulty</label>
                          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-300 appearance-none">
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                      </div>

                      {/* Description Section */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Problem Description</label>
                        <textarea 
                          value={form.description} 
                          onChange={(e) => setForm({ ...form, description: e.target.value })} 
                          placeholder="Given an array of integers nums and an integer target..." 
                          rows={5}
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-300 custom-scrollbar" 
                        />
                      </div>

                      {/* Constraints Section */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Constraints (One per line)</label>
                        <textarea 
                          value={form.constraints} 
                          onChange={(e) => setForm({ ...form, constraints: e.target.value })} 
                          placeholder="2 <= nums.length <= 10^4&#10;-10^9 <= nums[i] <= 10^9" 
                          rows={3}
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-300 custom-scrollbar" 
                        />
                      </div>

                      {/* Starter Code Section */}
                      <div className="pt-2">
                        <h3 className="text-sm font-bold text-zinc-200 mb-3 uppercase tracking-wide">Starter Code</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['javascript', 'python'].map((lang) => (
                            <div key={lang} className="space-y-2 group">
                              <label className="text-[11px] font-mono text-zinc-500 uppercase group-hover:text-indigo-400 transition-colors">{lang}</label>
                              <textarea
                                value={(form.starterCode as any)[lang]}
                                onChange={(e) => setForm({ ...form, starterCode: { ...form.starterCode, [lang]: e.target.value } })}
                                rows={4}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-3 text-xs text-zinc-300 font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200 custom-scrollbar"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <hr className="border-zinc-800" />

                      {/* Examples Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">Visible Examples</h3>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => addArrayItem('examples', { input: '', output: '', explanation: '' })} className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-md text-xs font-bold transition-colors">+ Add Example</motion.button>
                        </div>
                        <AnimatePresence>
                          {form.examples.map((ex, i) => (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, height: 0, y: -10 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -10, overflow: 'hidden' }}
                              key={`ex-${i}`} 
                              className="flex gap-4 p-4 border border-zinc-800 rounded-lg bg-zinc-950/30 group"
                            >
                              <div className="flex-1 space-y-3">
                                <input type="text" placeholder="Input (e.g. nums = [2,7,11,15], target = 9)" value={ex.input} onChange={(e) => updateArrayField('examples', i, 'input', e.target.value)} className="w-full bg-transparent border-b border-zinc-800/50 pb-1 text-sm text-zinc-300 font-mono focus:border-indigo-500 outline-none transition-colors" />
                                <input type="text" placeholder="Output (e.g. [0,1])" value={ex.output} onChange={(e) => updateArrayField('examples', i, 'output', e.target.value)} className="w-full bg-transparent border-b border-zinc-800/50 pb-1 text-sm text-zinc-300 font-mono focus:border-indigo-500 outline-none transition-colors" />
                                <input type="text" placeholder="Explanation (Optional)" value={ex.explanation} onChange={(e) => updateArrayField('examples', i, 'explanation', e.target.value)} className="w-full bg-transparent border-b border-zinc-800/50 pb-1 text-sm text-zinc-400 focus:border-indigo-500 outline-none transition-colors" />
                              </div>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeArrayItem('examples', i)} className="text-zinc-600 hover:text-red-400 self-start">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </motion.button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <hr className="border-zinc-800" />

                      {/* Test Cases Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">Hidden Test Cases</h3>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => addArrayItem('testCases', { input: '', expectedOutput: '' })} className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-md text-xs font-bold transition-colors">+ Add Test Case</motion.button>
                        </div>
                        <AnimatePresence>
                          {form.testCases.map((tc, i) => (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, height: 0, y: -10 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -10, overflow: 'hidden' }}
                              key={`tc-${i}`} 
                              className="flex gap-4 p-4 border border-zinc-800 rounded-lg bg-zinc-950/30 group items-start"
                            >
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Raw Input" value={tc.input} onChange={(e) => updateArrayField('testCases', i, 'input', e.target.value)} className="w-full bg-transparent border-b border-zinc-800/50 pb-1 text-sm text-zinc-300 font-mono focus:border-indigo-500 outline-none transition-colors" />
                                <input type="text" placeholder="Expected Output" value={tc.expectedOutput} onChange={(e) => updateArrayField('testCases', i, 'expectedOutput', e.target.value)} className="w-full bg-transparent border-b border-zinc-800/50 pb-1 text-sm text-zinc-300 font-mono focus:border-indigo-500 outline-none transition-colors" />
                              </div>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeArrayItem('testCases', i)} className="text-zinc-600 hover:text-red-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </motion.button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <hr className="border-zinc-800" />

                      {/* StdIO Execution Maps Section */}
                      <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg">
                        <div className="flex justify-between items-start mb-4 border-b border-zinc-800 pb-2">
                          <div>
                            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">StdIO Execution Maps <span className="text-red-500">*</span></h3>
                            <p className="text-xs text-zinc-500 mt-1">Maps backend runner files to problem structure. Ensure solve() is triggered.</p>
                          </div>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => addArrayItem('stdio', { python: 'solve()', javascript: 'solve()' })} className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-md text-xs font-bold transition-colors whitespace-nowrap">+ Add Map</motion.button>
                        </div>
                        <AnimatePresence>
                          <div className="space-y-3">
                            {form.stdio.map((st, i) => (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10, overflow: 'hidden' }}
                                key={`stdio-${i}`} 
                                className="flex gap-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900 group"
                              >
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {['python', 'javascript'].map(lang => (
                                    <div key={lang}>
                                      <label className="text-[10px] text-zinc-500 font-mono uppercase">{lang}</label>
                                      <input 
                                        type="text" 
                                        placeholder={lang === 'python' || lang === 'javascript' ? "solve()" : ""} 
                                        value={(st as any)[lang]} 
                                        onChange={(e) => updateArrayField('stdio', i, lang, e.target.value)} 
                                        className="w-full bg-transparent border-b border-zinc-800/50 pb-1 mt-1 text-xs text-zinc-300 font-mono outline-none focus:border-indigo-500 transition-colors" 
                                      />
                                    </div>
                                  ))}
                                </div>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeArrayItem('stdio', i)} className="text-zinc-600 hover:text-red-400 self-center">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        </AnimatePresence>
                      </div>

                    </div>
                    
                    {/* Submit Area Footer */}
                    <div className="p-6 bg-zinc-950/80 border-t border-zinc-800 backdrop-blur-sm">
                      <AnimatePresence>
                        {formMsg && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto", marginBottom: "16px" }}
                            exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0, overflow: "hidden" }}
                          >
                            {formMsg === "success" && <div className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 px-4 py-3 text-sm font-medium">Problem published successfully!</div>}
                            {formMsg === "error" && <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 text-sm font-medium">Please fill in the required fields.</div>}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button 
                        whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddProgram} 
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold transition-all duration-300 shadow-lg shadow-indigo-500/20"
                      >
                        Publish Problem
                      </motion.button>
                    </div>

                  </motion.div>
                </motion.div>
              )}
              
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Global Styles ── */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6366f1; }
      `}</style>
    </div>
  );
}
