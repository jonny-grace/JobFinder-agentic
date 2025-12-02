import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase, CheckCircle, Search } from "lucide-react"
import Link from "next/link"

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  // 1. Get Counts
  const { count: resumeCount } = await supabase
    .from('master_resumes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: appliedCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'applied')

  const { count: jobsFound } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .gt('match_score', 60) // Only relevant jobs

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.email?.split('@')[0]}</h1>
        <p className="text-slate-500 mt-2">Here is your job search overview.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        
        {/* Card 1: Resume Status */}
        <Link href="/dashboard/resume">
          <Card className="hover:border-black transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Master Resume</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{resumeCount ? "Ready" : "Missing"}</div>
              <p className="text-xs text-slate-500">Base for AI tailoring</p>
            </CardContent>
          </Card>
        </Link>
        
        {/* Card 2: Jobs Found */}
        <Link href="/dashboard/jobs">
          <Card className="hover:border-black transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Jobs Discovered</CardTitle>
              <Search className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{jobsFound}</div>
              <p className="text-xs text-slate-500">High match (&gt;60%) roles</p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Applications */}
        <Link href="/dashboard/applications">
          <Card className="hover:border-black transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Applied</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{appliedCount}</div>
              <p className="text-xs text-slate-500">Applications tracked</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}