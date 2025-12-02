'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { JobAnalysisView } from "@/components/job-analysis-view"

interface JobSheetProps {
  job: any
  trigger?: React.ReactNode // Make optional
  open?: boolean            // New prop
  onOpenChange?: (open: boolean) => void // New prop
}

export function JobSheet({ job, trigger, open, onOpenChange }: JobSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Only render trigger if provided */}
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      
      <SheetContent className="w-[90%] sm:w-[500px] overflow-y-auto bg-white">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold text-black">{job.title}</SheetTitle>
          <SheetDescription className="text-slate-600">{job.company}</SheetDescription>
        </SheetHeader>
        
        <JobAnalysisView 
           jobId={job.id} 
           description={job.description} 
           initialScore={job.match_score} 
        />
      </SheetContent>
    </Sheet>
  )
}