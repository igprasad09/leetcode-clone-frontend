import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import Signup from "./components/Signup";
import AuthLayout from "./components/AuthLayout";
import { Toaster } from "sonner";
import ProgramDetails from "./components/ProgramDetails";
import Leaderboard from "./components/Leaderboard";
import ProfileDashboard from "./components/ProfileDashboard";
import Contactus from "./components/Contactus";
import Admin from "./components/Admin";
import Contests from "./components/Contests";
import ContestPrograms from "./components/ContestPrograms";

function App() {
  return (
    <div className="w-full h-full">
      <Toaster position="top-right" richColors/>

        <Routes>
            <Route path="/login" element={<AuthLayout>
              <Login/>
            </AuthLayout>
          }/>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/signup" element={<AuthLayout>
              <Signup/>
            </AuthLayout>} />
            <Route path="/" element={<Navigate to={"/dashboard"}/>}/>
            <Route path="/leaderboard" element={<Leaderboard/>}/>
            <Route path="/program/:id" element={<ProgramDetails/>}/>
            <Route path="/profile" element={<ProfileDashboard/>}/>
            <Route path="/contact" element={<Contactus/>}/>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/contests" element={<Contests/>}/>
            <Route path="/contests/:id" element={<ContestPrograms/>}/>
        </Routes>

    </div>
  )
}

export default App
