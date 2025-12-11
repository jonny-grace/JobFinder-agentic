import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Land your dream remote job <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              on Auto-Pilot.
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            The AI agent that finds jobs, tailors your resume, and auto-fills
            applications. Stop applying manually.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="h-12 px-8 text-lg bg-black hover:bg-slate-800"
              >
                Start for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🌍"
              title="Smart Discovery"
              desc="Aggregates jobs from WeWorkRemotely, RemoteOK, and more. Filters out noise automatically."
            />
            <FeatureCard
              icon="📝"
              title="AI Tailoring"
              desc="Rewrites your resume for every single job application to beat the ATS score."
            />
            <FeatureCard
              icon="⚡️"
              title="Auto-Apply"
              desc="Chrome extension auto-fills forms on LinkedIn, Lever, and Greenhouse."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all">
      <div className="text-4xl  mb-4">{icon}</div>
      <h3 className="text-xl text-black font-bold mb-2">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}
