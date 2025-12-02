import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch ONLY 'applied' status
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (
        id,
        title,
        company,
        match_score
      )
    `)
    .eq('user_id', user?.id)
    .eq('status', 'applied') // STRICT FILTER
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-black">My Applications</h1>
        <p className="text-slate-600">Jobs you have officially applied to.</p>
      </div>

      <div className="grid gap-4">
        {applications?.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-white shadow-sm">
            <p className="text-slate-900 font-medium">No active applications.</p>
            <p className="text-slate-500 text-sm mb-4">Go find some jobs and click "Apply Now"!</p>
            <Link href="/dashboard/jobs">
              <Button className="bg-black text-white">Find Jobs</Button>
            </Link>
          </div>
        ) : (
          applications?.map((app: any) => (
            // WRAP IN LINK TO DETAIL PAGE
            <Link href={`/dashboard/jobs/${app.jobs.id}`} key={app.id} className="block">
              <Card className="group hover:border-black transition-all bg-white cursor-pointer">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  
                  {/* Job Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-black group-hover:text-blue-700 transition-colors">
                        {app.jobs.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span className="text-black font-medium">{app.jobs.company}</span>
                        <span>•</span>
                        <span>Applied {formatDistanceToNow(new Date(app.updated_at))} ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Score */}
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Match</div>
                      <Badge variant={app.jobs.match_score >= 90 ? 'default' : 'secondary'} className="text-sm">
                        {app.jobs.match_score}%
                      </Badge>
                    </div>

                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 px-3 py-1">
                      APPLIED
                    </Badge>
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}