"use server";

import { fetchAndProcessJobs } from "@/lib/jobs/crawler";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function triggerJobScan() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not logged in");

  // Fetch Resume
  const { data: resume } = await supabase
    .from("master_resumes")
    .select("content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }) // Get latest
    .limit(1)
    .single();

  const resumeContext = resume?.content ? JSON.stringify(resume.content) : "";

  // console.log(`👤 User: ${user.email}`);
  // console.log(`📄 Resume Found? ${!!resume}`);

  return await fetchAndProcessJobs(resumeContext);
}

export async function markJobAsApplied(jobId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  //
  // console.log(`🔄 Attempting to mark job ${jobId} as applied for user ${user.id}`)

  // 1. Try to UPDATE existing row (if it was a draft)
  const { data: existing, error: updateError } = await supabase
    .from("applications")
    .update({
      status: "applied",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("job_id", jobId)
    .select();

  if (updateError) {
    console.error("Update Failed:", updateError);
    throw new Error(updateError.message);
  }

  // 2. If no row existed to update, INSERT a new one
  if (!existing || existing.length === 0) {
    // console.log("No draft found, creating new application row...")
    const { error: insertError } = await supabase.from("applications").insert({
      user_id: user.id,
      job_id: jobId,
      status: "applied",
      // We don't have analysis yet, that's fine
    });

    if (insertError) {
      console.error("Insert Failed:", insertError);
      throw new Error(insertError.message);
    }
  }

  // console.log("✅ Success: Job marked as applied")

  // Update both pages so the UI reflects the change immediately
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/jobs");
}
