import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, MapPin, DollarSign, Calendar } from "lucide-react"
import { JobAnalysisView } from "@/components/job-analysis-view"
import { formatDistanceToNow } from "date-fns"
import { SmartApplyButton } from "@/components/smart-apply-button" // Import new component

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch Job
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (!job) return notFound()

    // console.log('show the full job file from the database', job)
  // Check if Applied
  let isApplied = false
  if (user) {
    const { data: app } = await supabase
      .from('applications')
      .select('status')
      .eq('job_id', id)
      .eq('user_id', user.id)
      .single()
    
    if (app?.status === 'applied') isApplied = true
  }

  // Helper for Salary
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified"
    if (min && !max) return `$${(min / 1000).toFixed(0)}k+`
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
    return "Not specified"
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-50/50">
      {/* Top Navigation */}
      <div className="mb-6">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" className="pl-0 hover:bg-transparent text-slate-500 hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN */}
        {/* If applied, center it (col-span-8 start-3). If not, standard layout. */}
        <div className={isApplied ? "lg:col-span-8 lg:col-start-3 space-y-8" : "lg:col-span-8 space-y-8"}>
          
          {/* Applied Banner */}
          {isApplied && (
             <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg text-center font-bold shadow-sm">
               ✅ You have already applied to this job.
             </div>
          )}

          {/* Job Header */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 text-lg font-medium text-slate-700">
                  {job.company}
                </div>
              </div>
              <SmartApplyButton 
        jobId={job.id} 
        url={job.url} 
        score={job.match_score || 0} 
        variant="outline"
        text="Original Post"
        className="gap-2 text-black border-slate-300 hover:bg-slate-50"
    />
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-600">
              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                Remote
              </div>
              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                Posted {formatDistanceToNow(new Date(job.created_at))} ago
              </div>
              {job.seniority && (
                <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                  {job.seniority}
                </Badge>
              )}
            </div>
          </div>

          {/* Description Content */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-black border-b pb-4">About the Role</h3>
            <div 
                className="prose prose-slate max-w-none 
                prose-p:text-slate-900 prose-p:leading-relaxed
                prose-li:text-slate-900 
                prose-headings:text-black prose-headings:font-bold
                prose-strong:text-black text-black
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: AI Analysis (HIDDEN IF APPLIED) */}
        {!isApplied && (
          <div className="lg:col-span-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto custom-scrollbar pr-1">
            <JobAnalysisView 
              jobId={job.id} 
              description={job.description} 
              initialScore={job.match_score} 
            />
          </div>
        )}

      </div>
    </div>
  )
}