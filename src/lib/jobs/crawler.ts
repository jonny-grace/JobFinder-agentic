import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY_CRAWLER! });
const parser = new Parser();

const FEEDS = [
  // Existing
  {
    url: "https://weworkremotely.com/categories/remote-programming-jobs.rss",
    source: "WeWorkRemotely",
  },
  { url: "https://remoteok.com/remote-dev-jobs.rss", source: "RemoteOK" },

  // NEW SOURCES
  { url: "https://hnrss.org/whoishiring/jobs", source: "HackerNews" }, // Hiring threads
  {
    url: "https://www.workingnomads.com/jobs?category=development&rss=1",
    source: "WorkingNomads",
  },
  { url: "https://remotive.com/remote-jobs/feed", source: "Remotive" },
];
function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

// Delay helper to prevent 429 errors
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAndProcessJobs(resumeContext: string = "") {
  console.log("🕷 Starting Job Crawler...");

  let totalNewJobs = 0;
  const JOB_LIMIT = 5; // Process 5 jobs per feed

  for (const feed of FEEDS) {
    let feedCount = 0; // Counter for this specific website

    try {
      const data = await parser.parseURL(feed.url);
      console.log(
        `🔎 Scanning ${feed.source}: Found ${data.items.length} raw items.`
      );

      for (const item of data.items.slice(0, JOB_LIMIT)) {
        const title = item.title ? cleanText(item.title) : "Unknown Role"; // FIX: Fallback for missing title
        const link = item.link || "";

        if (!link) continue;

        // 1. Duplicate Check
        const { data: existing } = await supabase
          .from("jobs")
          .select("id")
          .eq("url", link)
          .single();

        if (existing) continue;

        // 2. AI Analysis (With Rate Limit Handling)
        try {
          await sleep(2000); // Wait 2s

          const rawDescription = item.contentSnippet || item.content || "";
          const structuredData = await analyzeJobWithAI(
            rawDescription,
            resumeContext
          );

          // 3. Filter Low Scores
          if (structuredData.match_score <= 60) {
            // console.log(`   Skipping (Low Score): ${title}`);
            continue;
          }

          // 4. Insert
          const { error } = await supabase.from("jobs").insert({
            title: title,
            company: structuredData.company || "Unknown",
            description: structuredData.clean_html || rawDescription,
            url: link,
            source: feed.source,
            salary_min: structuredData.salary_min,
            salary_max: structuredData.salary_max,
            tech_stack: structuredData.tech_stack,
            seniority: structuredData.seniority,
            match_score: structuredData.match_score,
            match_reason: structuredData.match_reason,
            status: "new",
          });

          if (!error) {
            feedCount++;
            totalNewJobs++;
            console.log(
              `   ✅ Saved: ${title} (${structuredData.match_score}%)`
            );
          }
        } catch (aiError) {
          console.log(`   ✅ Saved: ${title} %)`);

          console.error(`   ⚠️ AI Error on "${title}":`, aiError);
        }
      }

      console.log(
        `📊 [${feed.source}] Summary: Added ${feedCount} new high-match jobs.`
      );
    } catch (err) {
      console.error(`❌ Feed Error (${feed.source}):`, err);
    }
  }

  console.log(`🏁 Crawler Finished. Total New Jobs: ${totalNewJobs}`);
  return { success: true, count: totalNewJobs };
}

async function analyzeJobWithAI(jobDescription: string, resumeContext: string) {
  const prompt = `
    You are a Recruitment AI. Process this job description.
    
    STEP 1: Scoring
    - Compare Candidate Resume to Job.
    - Calculate "match_score" (0-100).
    
    STEP 2: Content Formatting
    - Rewrite the description into CLEAN HTML (<h3>, <p>, <ul>, <li>).
    - DO NOT SUMMARIZE. KEEP ALL SECTIONS.
    
    Input Job: 
    ${jobDescription.substring(0, 6000)} 

    Candidate Resume:
    ${resumeContext ? resumeContext.substring(0, 3000) : "NO RESUME PROVIDED"}

    Return JSON Only:
    {
      "company": "string",
      "salary_min": number | null,
      "salary_max": number | null,
      "tech_stack": ["string"],
      "seniority": "string",
      "match_score": number, 
      "match_reason": "string",
      "clean_html": "string"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" },
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return { match_score: 0, match_reason: "AI Error" };

  return JSON.parse(text);
}
