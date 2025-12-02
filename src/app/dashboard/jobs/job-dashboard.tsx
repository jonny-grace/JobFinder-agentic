'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { JobCard } from '@/components/job-card'
import { JobSkeleton } from '@/components/job-skeleton'
import { Button } from '@/components/ui/button'
import { RefreshCw, Filter, Sparkles } from 'lucide-react' // Added Sparkles icon
import { triggerJobScan } from './actions'

// Accept draftJobIds prop
export function JobDashboard({ initialJobs, draftJobIds }: { initialJobs: any[], draftJobIds: string[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [isScanning, setIsScanning] = useState(false)
  
  // Create a Set for O(1) lookup
  const [draftSet, setDraftSet] = useState(new Set(draftJobIds))
  const hasScannedRef = useRef(false)
  const supabase = createClient()

  useEffect(() => {
    setDraftSet(new Set(draftJobIds))
  }, [draftJobIds])

  // 1. AUTO-SCAN ON LOAD
  useEffect(() => {
    if (!hasScannedRef.current) {
      hasScannedRef.current = true
      handleScan()
    }
  }, [])
  // 2. Realtime Listener
  useEffect(() => {
    const channel = supabase
      .channel('realtime-jobs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'jobs' },
        (payload) => {
          // Only add if > 60% (We don't filter drafts here because new jobs act as new)
          if (payload.new.match_score > 60) {
            setJobs((current) => [payload.new, ...current])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  const handleScan = async () => {
    setIsScanning(true)
    try {
      await triggerJobScan()
    } catch (e) {
      console.error(e)
    } finally {
      setIsScanning(false)
    }
  }

  // Filter the current state jobs one more time just to be safe
  // const visibleJobs = jobs.filter(job => !appliedSet.has(job.id))

  return (
    <div className="space-y-8 pb-12">
      {/* Header ... (Same as before) ... */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Job Discovery</h1>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
              Top Matches (&gt;60%)
            </span>
          </div>
          <p className="text-slate-600 mt-1 flex items-center gap-2">
            {isScanning ? (
               <>
                 <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                 <span>AI Agent is looking for new roles...</span>
               </>
            ) : (
               "Real-time AI crawler matching jobs to your resume."
            )}
          </p>
        </div>
        <Button onClick={handleScan} disabled={isScanning} variant="outline" className="text-slate-600 border-slate-300 min-w-[140px]">
          <RefreshCw className={`mr-2 h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Force Refresh'}
        </Button>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {jobs.map((job) => (
            <JobCard 
                key={job.id} 
                job={job} 
                isVisited={draftSet.has(job.id)} // <--- PASS THE PROP
            />
        ))}


        {isScanning && (
          <div className="space-y-4 pt-4 opacity-70 animate-pulse">
            <div className="flex items-center justify-center py-2 text-sm text-slate-500 gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              AI is analyzing fresh job feeds...
            </div>
            <JobSkeleton />
            <JobSkeleton />
          </div>
        )}

        {jobs.length === 0 && !isScanning && (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No New Matches</h3>
            <p className="text-slate-500 mb-4 max-w-sm mx-auto">
              You're all caught up! The AI hasn't found any new jobs matching your criteria right now.
            </p>
            <Button variant="outline" onClick={handleScan}>Check Again</Button>
          </div>
        )}
      </div>
    </div>
  )
}