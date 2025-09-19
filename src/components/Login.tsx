import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/cart";
import { useRecoilState } from "recoil";
import { userAtom } from "@/context";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BackgroundBeams } from "./ui/background-beams";
import { toast } from "sonner";

export default function Login() {
  const [user, setUser] = useRecoilState(userAtom);
  const navigation = useNavigate();

  // 🔹 Email/Password Login
  async function handle_login() {
    if (!user.email || !user.password) {
      return toast.error("Input is required!");
    }
    try {
      const res = await axios.post("https://backend-nine-red-85.vercel.app/login", user, {
        withCredentials: true,
      });
      if(res.data.message == "Success"){
          navigation("/dashboard")
      }else{
          toast.error(res.data.message)
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black/[0.96] relative overflow-hidden">
      <BackgroundBeams/>

      <Card className="w-full max-w-sm bg-black text-white">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>
          <CardAction>
             <Link to={"/signup"}>
               <Button variant="link" className="underline text-white cursor-pointer">
                    Sign Up
              </Button>
             </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button variant={"outline"} onClick={handle_login} className="w-full text-black cursor-pointer">
            Login
          </Button>
          <Button onClick={() => window.location.href = "http://localhost:3000/google"} className="w-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="2443" height="2500" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google">
                   <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                   <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                   <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                   <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
            </svg>
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
