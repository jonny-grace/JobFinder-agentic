'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { markJobAsApplied } from "@/app/dashboard/jobs/actions"
import { useRouter } from "next/navigation"

interface SmartApplyButtonProps {
  jobId: string
  url: string
  score: number
  variant?: "default" | "outline" // To style it differently
  className?: string
  text?: string
}

export function SmartApplyButton({ jobId, url, score, variant = "default", className, text = "Apply Now" }: SmartApplyButtonProps) {
  const [showLowScoreAlert, setShowLowScoreAlert] = useState(false)
  const [showDidApplyAlert, setShowDidApplyAlert] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const router = useRouter()

  // 1. Handle Click Logic
  const handleClick = () => {
    if (score < 90) {
      setShowLowScoreAlert(true)
    } else {
      proceedToExternalApply()
    }
  }

  // 2. Open Link & Wait
  const proceedToExternalApply = () => {
    setShowLowScoreAlert(false)
    window.open(url, '_blank')
    
    // Show confirmation dialog after delay
    setTimeout(() => {
      setShowDidApplyAlert(true)
    }, 2000)
  }

  // 3. Mark as Applied Logic
  const handleConfirmApplied = async () => {
    setIsMarking(true)
    try {
      await markJobAsApplied(jobId)
      alert("✅ Job marked as applied!")
      setShowDidApplyAlert(false)
      router.refresh() // Reloads data on the page
    } catch (e) {
      console.error(e)
      alert("Failed to update status")
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <>
      <Button variant={variant} className={className} onClick={handleClick}>
        {text} <ExternalLink className="ml-2 h-4 w-4" />
      </Button>

      {/* ALERT 1: LOW SCORE */}
      <AlertDialog open={showLowScoreAlert} onOpenChange={setShowLowScoreAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black flex items-center gap-2">
              <AlertTriangle className="text-amber-500" />
              Low Match Score ({score}%)
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Your resume is below 90%. It is highly recommended to tailor your resume before applying.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-slate-500">Cancel</AlertDialogCancel>
            {/* Note: We don't have the 'Modify' button here because this component is isolated. 
                User can close this and use the sidebar on the page. */}
            <Button onClick={proceedToExternalApply} className="bg-black text-white hover:bg-slate-800">
              Apply Anyway
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ALERT 2: DID YOU APPLY? */}
      <AlertDialog open={showDidApplyAlert} onOpenChange={setShowDidApplyAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black flex items-center gap-2">
              <CheckCircle className="text-blue-600" />
              Did you submit the application?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              If yes, we will move this job to your "Applied" list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDidApplyAlert(false)}>No</AlertDialogCancel>
            <Button 
                onClick={(e) => {
                    e.preventDefault()
                    handleConfirmApplied()
                }} 
                disabled={isMarking}
                className="bg-black text-white hover:bg-slate-800"
            >
              {isMarking ? "Saving..." : "Yes, I Applied"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}