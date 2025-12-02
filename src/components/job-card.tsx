'use client'

import { useState } from "react"
import Link from "next/link"
import { JobSheet } from "./job-sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Building2, Clock, DollarSign, Eye } from "lucide-react" // Import Eye icon
import { SmartApplyButton } from "./smart-apply-button"

interface JobProps {
  job: any
  isApplied?: boolean
  isVisited?: boolean // <--- NEW PROP
}

export function JobCard({ job, isApplied = false, isVisited = false }: JobProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Helpers...
  const formatSalary = (min: number | null, max: number | null) => { /*...*/ return null }
  const getScoreColor = (score: number) => { /*...*/ return "" }

  return (
    <>
      <Card className={`group relative overflow-hidden border-slate-200 transition-all hover:border-black hover:shadow-md bg-white ${isApplied ? 'opacity-80 bg-slate-50' : ''}`}>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between p-6">
            
            {/* LEFT SIDE: Clickable Body */}
            <Link href={`/dashboard/jobs/${job.id}`} className="flex-1 space-y-3 cursor-pointer block">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Building2 className="h-3 w-3" />
                    <span className="font-medium text-black">{job.company || "Unknown Company"}</span>
                    <span>•</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{job.source}</span>
                    
                    {/* VISITED BADGE */}
                    {isVisited && !isApplied && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                            <Eye className="h-3 w-3" /> Visited
                        </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-black leading-tight group-hover:text-blue-700 transition-colors pr-4">
                    {job.title}
                  </h3>
                </div>

                {/* Score Badge */}
                {job.match_score !== undefined && job.match_score > 0 && (
                  <div className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border min-w-[60px] ${getScoreColor(job.match_score)}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Match</span>
                    <span className="text-lg font-black leading-none">{job.match_score}%</span>
                  </div>
                )}
              </div>

              {/* ... Rest of card details (salary, date, etc) ... */}
              <div className="flex flex-wrap items-center gap-3 text-sm pt-1">
                 {/* ... */}
                 <div className="flex items-center text-slate-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                </div>
              </div>
            </Link>

            {/* RIGHT SIDE: Buttons */}
            <div className="flex flex-col gap-2 min-w-[140px] pt-1 relative z-10">
               {isApplied ? (
                 <Button disabled className="w-full bg-green-50 text-green-700 border border-green-200 font-bold">
                    Applied ✅
                 </Button>
               ) : (
                 <>
                   <SmartApplyButton 
                      jobId={job.id}
                      url={job.url}
                      score={job.match_score || 0}
                      className="w-full bg-black text-white hover:bg-slate-800 shadow-sm font-semibold"
                   />

                   <Button 
                     variant="outline" 
                     className="w-full border-slate-300 text-black hover:bg-slate-50 font-medium"
                     onClick={() => setIsSheetOpen(true)}
                   >
                      {isVisited ? "Continue Analysis" : "Quick Analysis"}
                   </Button>
                 </>
               )}
            </div>
          </div>
        </CardContent>
      </Card>

      {!isApplied && (
        <JobSheet 
            job={job} 
            open={isSheetOpen} 
            onOpenChange={setIsSheetOpen} 
        />
      )}
    </>
  )
}