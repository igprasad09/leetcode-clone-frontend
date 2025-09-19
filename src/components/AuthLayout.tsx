import { BackgroundBeams } from "../components/ui/background-beams"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black/[0.96] relative overflow-hidden">
      {/* Background stays mounted */}
      <BackgroundBeams />

      {/* Page content */}
      {children}
    </div>
  )
}
