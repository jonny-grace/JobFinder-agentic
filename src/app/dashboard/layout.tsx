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
import { signout } from "@/app/auth/actions"; // <--- IMPORT THE ACTION

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optional: Redirect if session is invalid (double check)
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        {/* ... Logo & Links ... */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-black"
        >
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          ResumeAgent
        </Link>

        {/* ... Navigation Links ... */}

        <div className="ml-auto flex items-center gap-4">
          <div className="text-xs font-medium text-slate-500 hidden sm:block">
            {user.email}
          </div>

          {/* UPDATED SIGNOUT FORM */}
          <form action={signout}>
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

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">{children}</main>

      {/* Footer */}
    </div>
  );
}
