import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ResumeForm from "./resume-form" // Import the new form

export default async function ResumePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // FETCH: Try to find the existing resume
  // We look for 'is_current' first, or just the most recent one
  const { data: resume } = await supabase
    .from('master_resumes')
    .select('content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Pass the data (or null) to the client form
  return <ResumeForm initialData={resume?.content || null} />
}