import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Briefcase,
  Search,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-black"
        >
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          ResumeAgent
        </Link>

        <nav className="flex items-center gap-6 ml-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-black transition-colors"
          >
            <User className="h-4 w-4" /> Overview
          </Link>
          <Link
            href="/dashboard/jobs"
            className="flex items-center gap-2 text-slate-600 hover:text-black transition-colors"
          >
            <Search className="h-4 w-4" /> Find Jobs
          </Link>
          <Link
            href="/dashboard/applications"
            className="flex items-center gap-2 text-slate-600 hover:text-black transition-colors"
          >
            <Briefcase className="h-4 w-4" /> Applications
          </Link>
          <Link
            href="/dashboard/resume"
            className="flex items-center gap-2 text-slate-600 hover:text-black transition-colors"
          >
            <FileText className="h-4 w-4" /> Master Resume
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-xs font-medium text-slate-500 hidden sm:block">
            {user.email}
          </div>
          <form action="/auth/signout" method="post">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-300 text-black hover:bg-slate-100"
            >
              <LogOut className="mr-2 h-3 w-3" /> Sign Out
            </Button>
          </form>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">{children}</main>

      {/* FOOTER */}
      <footer className="border-t bg-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ResumeAgent. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
