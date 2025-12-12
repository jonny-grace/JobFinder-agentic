import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAndProcessJobs } from "@/lib/jobs/crawler";

// Allow this route to run for up to 60 seconds (Vercel Limit)
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST() {
  console.log("⚡️ API: Background Scan Triggered");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Fetch Resume Context
  const { data: resume } = await supabase
    .from("master_resumes")
    .select("content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const resumeContext = resume?.content ? JSON.stringify(resume.content) : "";

  // 2. Run Crawler (Awaited here, but running in its own process)
  const result = await fetchAndProcessJobs(resumeContext);

  return NextResponse.json({ success: true, count: result.count });
}
