import { createClient } from '@/lib/supabase/server'
import { JobDashboard } from './job-dashboard'

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let appliedJobIds: string[] = []
  let draftJobIds: string[] = []

  if (user) {
    const { data: apps } = await supabase
      .from('applications')
      .select('job_id, status')
      .eq('user_id', user.id)
      .in('status', ['applied', 'draft']) 
    
    if (apps) {
      // 1. IDs to HIDE (Applied)
      appliedJobIds = apps
        .filter(a => a.status === 'applied')
        .map(a => a.job_id)

      // 2. IDs to Show as VISITED (Draft)
      draftJobIds = apps
        .filter(a => a.status === 'draft')
        .map(a => a.job_id)
    }
  }

  // 3. Fetch Jobs (Only > 60%)
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .gt('match_score', 60)
    .order('created_at', { ascending: false })
    .limit(100)

  // 4. FILTER: Remove ONLY 'applied' jobs. Keep 'drafts'.
  const filteredJobs = jobs?.filter(job => !appliedJobIds.includes(job.id)) || []

  return <JobDashboard initialJobs={filteredJobs} draftJobIds={draftJobIds} />
}