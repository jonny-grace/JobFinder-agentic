import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Briefcase, Search, User, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-extrabold text-2xl flex items-center gap-2 text-black">
            🤖 Agent
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard">
            {/* Added text-black and font-medium */}
            <Button variant="ghost" className="w-full justify-start gap-3 text-black font-medium hover:bg-slate-100 hover:text-gray-600">
              <User className="h-5 w-5" />
              Home
            </Button>
          </Link>
          <Link href="/dashboard/resume">
            <Button variant="ghost" className="w-full justify-start gap-3 text-black font-medium hover:bg-slate-100 hover:text-gray-600">
              <FileText className="h-5 w-5" />
              Master Resume
            </Button>
          </Link>
          <Link href="/dashboard/jobs">
            <Button variant="ghost" className="w-full justify-start gap-3 text-black cursor-not-allowed hover:text-gray-600">
              <Search className="h-5 w-5" />
              Job Search
            </Button>
          </Link>
          <Link href="/dashboard/applications">
            <Button variant="ghost" className="w-full justify-start gap-3 text-black cursor-not-allowed hover:text-gray-600">
              <Briefcase className="h-5 w-5" />
              Applications
            </Button>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="text-xs font-bold text-black mb-2 truncate">
            {user.email}
          </div>
          <form action="/auth/signout" method="post">
             <Button variant="outline" className="w-full text-xs h-9 border-slate-300 text-black hover:bg-slate-100">
               <LogOut className="mr-2 h-4 w-4" /> Sign Out
             </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}