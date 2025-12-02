'use server'

import { createClient } from "@/lib/supabase/server"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! })

export async function generateTailoredResume(jobId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")
  
    const { data: job } = await supabase.from('jobs').select('description, title, company').eq('id', jobId).single()
    const { data: master } = await supabase.from('master_resumes').select('content').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single()
  
    if (!job) throw new Error("Job not found")
    if (!master) throw new Error("Master resume not found")
  
    // 1. REWRITE RESUME
    const rewritePrompt = `
    You are an Expert Resume Editor.
    Your task is to rewrite the content of the resume to target the job: ${job.title} at ${job.company}.

    CRITICAL INSTRUCTIONS (READ CAREFULLY):
    1. PRESERVE ALL ENTRIES: You must NOT remove any item from 'workExperience', 'projects', or 'education'. If the input has 4 jobs, the output MUST have 4 jobs.
    2. MODIFY DESCRIPTIONS: Rewrite the 'description' fields for jobs and projects to emphasize keywords found in the Job Description. Use active verbs (e.g., "Engineered", "Deployed").
    3. TAILOR SUMMARY: Completely rewrite the 'summary' to pitch the candidate specifically for this role.
    4. RETAIN FACTS: Do not change Dates, Company Names, or Job Titles. Only optimize the *description* text.
    5. SKILLS: You may reorder skills or add relevant ones from the job description if the candidate's experience supports it.

    Return JSON with TWO parts:
    1. "content": The full resume JSON.
    2. "changes": An array of strings listing specific optimizations (e.g., "Optimized Project A description", "Added 'TypeScript' to skills").

    Job Description: 
    ${job.description.substring(0, 4000)}

    Candidate Resume JSON: 
    ${JSON.stringify(master.content)}
  `

  
    const rewriteResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: rewritePrompt }] }],
      config: { responseMimeType: "application/json" }
    })
  
    const response = JSON.parse(rewriteResult.candidates?.[0]?.content?.parts?.[0]?.text || "{}")
  
    // 2. AUTO-CALCULATE NEW SCORE (Chain the second AI call immediately)
    const scorePrompt = `
      Calculate the Match Score (0-100) for this NEW resume against the job.
      Return JSON: { "score": number }
      
      Job: ${job.description.substring(0, 3000)}
      Resume: ${JSON.stringify(response.content).substring(0, 3000)}
    `
  
    const scoreResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: scorePrompt }] }],
      config: { responseMimeType: "application/json" }
    })
  
    const scoreData = JSON.parse(scoreResult.candidates?.[0]?.content?.parts?.[0]?.text || "{}")
  
    // Return merged data
    return {
      content: response.content,
      changes: response.changes,
      score: scoreData.score || 0 // Pass score back to UI
    }
  }
// Re-Score the edited resume
export async function rescoreResume(jobId: string, resumeContent: any) {
  const supabase = await createClient()
  const { data: job } = await supabase.from('jobs').select('description').eq('id', jobId).single()
  
  // FIX 2: Handle Null Job
  if (!job) throw new Error("Job not found")

  const prompt = `
    Calculate the Match Score (0-100) for this resume against the job.
    Return JSON: { "score": number }
    
    Job: ${job.description.substring(0, 3000)}
    Resume: ${JSON.stringify(resumeContent).substring(0, 3000)}
  `
  
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash", // Switched to 1.5-flash for stability/availability
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" }
  })
  
  // FIX 3: Correct SDK Response Access path
  return JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text || "{}")
}