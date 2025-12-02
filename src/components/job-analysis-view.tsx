'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, CheckCircle2, XCircle, Wand2, ArrowRight, ListChecks } from "lucide-react"
import { getJobAnalysis } from "@/app/dashboard/jobs/analysis-action"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export function JobAnalysisView({ jobId, description, initialScore }: { jobId: string, description: string, initialScore: number }) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const data = await getJobAnalysis(jobId, description)
        setAnalysis(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalysis()
  }, [jobId, description])

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 border rounded-xl bg-slate-50">
        <Loader2 className="h-8 w-8 text-black animate-spin" />
        <p className="text-sm text-slate-600">Analyzing resume fit...</p>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
     {/* Score Card */}
     <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Match Score</span>
            <span className={`text-3xl font-black ${analysis.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
              {analysis.score}%
            </span>
          </div>
          <Progress
  value={analysis.score}
  className={`h-3 bg-slate-100
    [&>div]:${analysis.score >= 70 ? "bg-green-600" : "bg-amber-500"}
  `}
/>
        </CardHeader>
        <CardContent className="pt-4">
          
          {/* NEW: Short Executive Summary */}
          <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mb-4">
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2 text-sm">
            <ListChecks className="h-4 w-4 text-slate-500" /> Key Findings
          </h4>
          <ul className="space-y-2">
            {analysis.key_findings?.map((finding: string, i: number) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                {finding}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      

      {/* Skills Grid */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-green-200 bg-green-50/50 shadow-none">
          <CardContent className="pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Matched Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.matching_keywords?.map((k: string) => (
                <Badge key={k} className="bg-white text-green-700 border-green-200 hover:bg-green-50">
                  {k}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 shadow-none">
          <CardContent className="pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4" /> Missing Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.missing_keywords?.map((k: string) => (
                <Badge key={k} variant="outline" className="bg-white border-red-200 text-red-700">
                  {k}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Box */}
      <Card className="bg-slate-900 text-white border-slate-900">
        <CardContent className="p-5">
          <h4 className="font-bold text-lg mb-1">Tailor Resume</h4>
          <p className="text-slate-400 text-xs mb-4">
            Generate a new PDF optimized for this job.
          </p>
          <Link href={`/dashboard/jobs/${jobId}/tailor`}>
    <Button className="w-full bg-white text-black hover:bg-slate-200 font-bold">
        <Wand2 className="mr-2 h-4 w-4" />
        Auto-Fix & Generate
        <ArrowRight className="ml-auto h-4 w-4" />
    </Button>
</Link>
        </CardContent>
      </Card>
    </div>
  )
}