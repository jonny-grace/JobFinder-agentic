import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className=" text-black">ResumeAgent</div>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-black font-medium hover:underline"
          >
            Login
          </Link>
          <Link href="/login">
            <Button className="bg-black text-white hover:bg-slate-800">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
