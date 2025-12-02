'use server'

import { createClient } from "@/lib/supabase/server"
import { GoogleGenAI } from "@google/genai"
import { revalidatePath } from "next/cache"

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! })

export async function getJobAnalysis(jobId: string, jobDescription: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // 1. GET TRUTH (Job Score) & Check Existing App
  const { data: jobData } = await supabase.from('jobs').select('match_score').eq('id', jobId).single()
  const TRUTH_SCORE = jobData?.match_score || 0

  const { data: existingApp } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .eq('user_id', user.id)
    .single()

  // 2. RETURN CACHED IF EXISTS
  if (existingApp?.match_analysis) {
    // Sync score to job table if needed
    if (existingApp.match_analysis.score) {
       await supabase.from('jobs').update({ match_score: existingApp.match_analysis.score }).eq('id', jobId)
    }
    return existingApp.match_analysis
  }

  // 3. RUN AI (If no cache)
  const { data: master } = await supabase
    .from('master_resumes')
    .select('content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const prompt = `
    You are a Career Coach.
    The candidate has a strict Match Score of ${TRUTH_SCORE}%. 
    Do NOT recalculate this score. Explain it.
    Return JSON ONLY:
    {
      "score": ${TRUTH_SCORE}, 
      "summary": "2 sentence summary.", 
      "matching_keywords": ["k1", "k2"],
      "missing_keywords": ["k1", "k2"],
      "key_findings": ["f1", "f2"],
      "fix_suggestions": ["fix1"]
    }
    Job: ${jobDescription.substring(0, 3000)}
    Resume: ${JSON.stringify(master?.content || {}).substring(0, 3000)}
  `

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" }
  })

  const analysis = JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text || "{}")
  analysis.score = TRUTH_SCORE

  // 4. SAVE (CRITICAL FIX: Preserve Status)
  // If we already have an application row (e.g. status='applied'), KEEP IT.
  // If not, start as 'draft'.
  const currentStatus = existingApp?.status || 'draft'

  await supabase
    .from('applications')
    .upsert({
      user_id: user.id,
      job_id: jobId,
      match_analysis: analysis,
      tailored_resume_content: master?.content, 
      status: currentStatus // <--- FIXED: Don't force overwrite to 'draft'
    }, { onConflict: 'user_id, job_id' })

  // 5. Force Update Job Score
  if (analysis.score) {
    await supabase
      .from('jobs')
      .update({ match_score: analysis.score, match_reason: analysis.summary })
      .eq('id', jobId)
  }

  revalidatePath(`/dashboard/jobs/${jobId}`)
  
  return analysis
}