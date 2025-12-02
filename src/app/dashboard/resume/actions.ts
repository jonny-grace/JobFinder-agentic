'use server'

import { createClient } from '@/lib/supabase/server'
import { ResumeFormValues } from '@/lib/schemas/resume'
import { revalidatePath } from 'next/cache'

export async function saveResume(data: ResumeFormValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Upsert into master_resumes
  // We search for a resume belonging to this user. If found, update. If not, insert.
  // Note: Our SQL schema has `user_id`.
  
  // First, check if one exists
  const { data: existing } = await supabase
    .from('master_resumes')
    .select('id')
    .eq('user_id', user.id)
    .single()

  let error;
  
  if (existing) {
    const { error: updateError } = await supabase
      .from('master_resumes')
      .update({ content: data, updated_at: new Date().toISOString() }) // Ensure you have updated_at in schema or remove this field
      .eq('id', existing.id)
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('master_resumes')
      .insert({
        user_id: user.id,
        content: data,
        is_current: true
      })
    error = insertError
  }

  if (error) {
    console.error(error)
    throw new Error("Failed to save resume")
  }

  revalidatePath('/dashboard/resume')
  return { success: true }
}