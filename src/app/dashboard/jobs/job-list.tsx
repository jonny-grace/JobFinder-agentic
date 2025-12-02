'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { JobCard } from '@/components/job-card'
import { Loader2 } from 'lucide-react'

export function JobList({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to NEW insertions in the 'jobs' table
    const channel = supabase
      .channel('realtime-jobs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'jobs' },
        (payload) => {
          console.log('⚡️ New Job Received:', payload.new)
          // Prepend the new job to the list instantly
          setJobs((current) => [payload.new, ...current])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (jobs.length === 0) {
    return (
       <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <h3 className="text-lg font-medium text-slate-900">No jobs found yet</h3>
          <p className="text-slate-500 mb-4">Click "Find New Jobs" to start the AI agent.</p>
       </div>
    )
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}