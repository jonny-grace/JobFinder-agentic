import { login, signup, loginWithGoogle } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
import { Chrome } from "lucide-react" // Ensure you installed lucide-react

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 bg-gray-600 lg:flex flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            🤖
          </div>
          ResumeAgent
        </div>
        <div className="space-y-4">
          <blockquote className="text-2xl font-medium leading-normal">
            "This agent saved me 40 hours of job hunting in the first week alone. It's not just a tool; it's my career pilot."
          </blockquote>
          <div className="text-sm text-slate-400">Sofia Davis, Senior Product Designer</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center lg:w-1/2 px-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-slate-500">
              Enter your email below to create your account
            </p>
          </div>

          <div className="grid gap-6">
            <form>
              <div className="grid gap-4">
                <Button 
                  formAction={loginWithGoogle} 
                  variant="outline" 
                  className="w-full gap-2"
                >
                  <Chrome className="h-4 w-4" />
                  Continue with Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-50 px-2 text-slate-500">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                  />
                </div>
                <Button formAction={login} className="w-full bg-black text-white hover:bg-slate-800">
                  Sign In with Email
                </Button>
                <Button formAction={signup} variant="ghost" className="w-full text-xs">
                  Don't have an account? Sign Up
                </Button>
              </div>
            </form>
          </div>
          
          <p className="px-8 text-center text-sm text-slate-500">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}