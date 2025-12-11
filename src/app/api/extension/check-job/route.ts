import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { url } = await req.json();

  // 1. Normalize URL
  const cleanUrl = url.split("?")[0].replace(/\/$/, "");

  // 2. Find Job
  const { data: jobs } = await supabaseAdmin.from("jobs").select("id, url");

  if (!jobs) return NextResponse.json({ found: false });

  const matchedJob = jobs.find((j) => {
    const dbUrl = j.url.split("?")[0].replace(/\/$/, "");
    return (
      dbUrl === cleanUrl || dbUrl.includes(cleanUrl) || cleanUrl.includes(dbUrl)
    );
  });

  if (!matchedJob) {
    return NextResponse.json({ found: false });
  }

  // 3. Find Resume & Analysis
  const { data: app } = await supabaseAdmin
    .from("applications")
    .select(
      `
      tailored_resume_content, 
      match_analysis, 
      jobs (
        match_score
      )
    `
    )
    .eq("job_id", matchedJob.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!app) {
    return NextResponse.json({ found: false });
  }

  // FIX: Priority -> Tailored Score > Analysis Score > Original Job Score
  let score = 0;

  // Try to find score in the AI Analysis JSON
  if (app.match_analysis && typeof app.match_analysis === "object") {
    const analysis: any = app.match_analysis;
    if (analysis.score) score = analysis.score;
  }

  // Fallback to Job Score
  if (!score) {
    score = (app.jobs as any)?.match_score || 0;
  }

  return NextResponse.json({
    found: true,
    score: score,
    resume: app.tailored_resume_content,
  });
}
