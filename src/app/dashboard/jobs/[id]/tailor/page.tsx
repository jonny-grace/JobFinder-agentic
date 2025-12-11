"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateTailoredResume, rescoreResume } from "./actions";
import {
  Loader2,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Dynamic Imports
const PdfPreview = dynamic(() => import("./pdf-preivew"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-slate-400">
      Loading Preview...
    </div>
  ),
});

const PdfDownloadButton = dynamic(
  () => import("./pdf-preivew").then((mod) => mod.PdfDownloadButton),
  {
    ssr: false,
    loading: () => (
      <Button size="sm" disabled>
        Loading...
      </Button>
    ),
  }
);

export default function TailorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [data, setData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [changes, setChanges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState("classic");
  const [newScore, setNewScore] = useState<number | null>(null);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const init = async () => {
      try {
        const result = await generateTailoredResume(id);
        if (isCancelled) return;

        const content = result.content;

        // FIX: Ensure Skills is a string for the Textarea
        if (content.skills && typeof content.skills !== "string") {
          if (Array.isArray(content.skills)) {
            content.skills = content.skills.join(", ");
          } else if (typeof content.skills === "object") {
            content.skills = Object.values(content.skills).join(", ");
          }
        }

        // FIX: Ensure Projects Array exists
        if (!content.projects) content.projects = [];

        setData(content);
        setPreviewData(content);
        setChanges(result.changes || []);
        setNewScore(result.score);
      } catch (e) {
        console.error(e);
        alert("Failed to generate resume.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    init();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Debounce PDF Updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewData(data);
    }, 800);
    return () => clearTimeout(timer);
  }, [data]);

  // --- UPDATERS ---
  const updateContact = (field: string, value: string) =>
    setData({ ...data, contact: { ...data.contact, [field]: value } });
  const updateSummary = (value: string) => setData({ ...data, summary: value });
  const updateSkills = (value: string) => setData({ ...data, skills: value });

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...data.workExperience];
    newExp[index] = { ...newExp[index], [field]: value };
    setData({ ...data, workExperience: newExp });
  };
  const removeExperience = (index: number) => {
    const newExp = data.workExperience.filter(
      (_: any, i: number) => i !== index
    );
    setData({ ...data, workExperience: newExp });
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setData({ ...data, education: newEdu });
  };

  const updateProject = (index: number, field: string, value: any) => {
    const newProj = data.projects ? [...data.projects] : [];
    if (!newProj[index]) newProj[index] = {};
    newProj[index] = { ...newProj[index], [field]: value };
    setData({ ...data, projects: newProj });
  };
  const removeProject = (index: number) => {
    const newProj = data.projects.filter((_: any, i: number) => i !== index);
    setData({ ...data, projects: newProj });
  };
  const addProject = () => {
    const newProj = data.projects ? [...data.projects] : [];
    newProj.push({ name: "", link: "", description: "" });
    setData({ ...data, projects: newProj });
  };

  const handleRescore = async () => {
    setScoring(true);
    try {
      const result = await rescoreResume(id, data);
      setNewScore(result.score);
    } catch (e) {
      console.error(e);
    } finally {
      setScoring(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 space-y-6">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <h2 className="text-2xl font-bold text-black">Tailoring Resume...</h2>
      </div>
    );
  }

  const inputClass =
    "h-9 text-sm text-black font-medium border-slate-300 focus:border-black placeholder:text-slate-400";

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* HEADER */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/jobs/${id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-black hover:bg-slate-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-lg text-black">Resume Editor</h1>
            {newScore !== null && (
              <Badge
                variant={newScore > 70 ? "default" : "destructive"}
                className="text-sm"
              >
                New Score: {newScore}%
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRescore}
            disabled={scoring}
            className="hidden sm:flex text-black border-slate-300"
          >
            <RefreshCw
              className={`mr-2 h-3 w-3 ${scoring ? "animate-spin" : ""}`}
            />
            Check Score
          </Button>

          <Tabs
            value={template}
            onValueChange={setTemplate}
            className="w-[180px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="classic">Classic</TabsTrigger>
              <TabsTrigger value="modern">Modern</TabsTrigger>
            </TabsList>
          </Tabs>

          {previewData && <PdfDownloadButton data={previewData} />}
        </div>
      </div>

      {/* MAIN SPLIT VIEW */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: EDITOR */}
        <div className="w-1/2 h-full overflow-y-auto custom-scrollbar bg-white border-r border-slate-200">
          <div className="p-6 space-y-8 max-w-2xl mx-auto pb-20">
            {changes.length > 0 && (
              <Accordion
                type="single"
                collapsible
                className="w-full border rounded-lg bg-amber-50 border-amber-200 px-4"
              >
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="py-3 text-amber-900 hover:no-underline text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      View {changes.length} AI Optimizations
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 pb-3 text-xs text-amber-900">
                      {changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <section className="space-y-4">
              <h3 className="font-bold text-black border-b pb-2">
                Contact Info
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-black">Full Name</Label>
                  <Input
                    className={inputClass}
                    value={data.contact.fullName}
                    onChange={(e) => updateContact("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-black">Email</Label>
                  <Input
                    className={inputClass}
                    value={data.contact.email}
                    onChange={(e) => updateContact("email", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-black">Location</Label>
                  <Input
                    className={inputClass}
                    value={data.contact.location}
                    onChange={(e) => updateContact("location", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-black">Portfolio</Label>
                  <Input
                    type="url"
                    className={inputClass}
                    value={data.contact.portfolio || ""}
                    onChange={(e) => updateContact("portfolio", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-black">LinkedIn</Label>
                  <Input
                    type="url"
                    className={inputClass}
                    value={data.contact.linkedin}
                    onChange={(e) => updateContact("linkedin", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-black border-b pb-2 flex justify-between items-center">
                Summary{" "}
                <Badge
                  variant="outline"
                  className="text-[10px] font-normal bg-green-50 text-green-700 border-green-200"
                >
                  AI Optimized
                </Badge>
              </h3>
              <Textarea
                value={data.summary}
                onChange={(e) => updateSummary(e.target.value)}
                className="min-h-[120px] text-sm text-black border-slate-300"
              />
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-black border-b pb-2">Skills</h3>
              <Textarea
                value={data.skills}
                onChange={(e) => updateSkills(e.target.value)}
                className="min-h-[80px] text-sm text-black border-slate-300"
              />
            </section>

            {/* PROJECTS SECTION */}
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-black">Projects</h3>
                <Button variant="ghost" size="sm" onClick={addProject}>
                  <Plus className="h-4 w-4 text-blue-600" />
                </Button>
              </div>
              {data.projects?.map((proj: any, index: number) => (
                <Card key={index} className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 pb-2 bg-slate-50 flex flex-row items-center justify-between">
                    <div className="font-semibold text-sm text-black">
                      Project #{index + 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          className={inputClass}
                          value={proj.name}
                          onChange={(e) =>
                            updateProject(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Link</Label>
                        <Input
                          type="url"
                          className={inputClass}
                          value={proj.link}
                          onChange={(e) =>
                            updateProject(index, "link", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <Textarea
                      value={proj.description}
                      onChange={(e) =>
                        updateProject(index, "description", e.target.value)
                      }
                      className="min-h-[80px] text-sm font-mono text-black border-slate-300"
                      placeholder="Description..."
                    />
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="space-y-4">
              <h3 className="font-bold text-black border-b pb-2">Experience</h3>
              {data.workExperience?.map((job: any, index: number) => (
                <Card key={index} className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 pb-2 bg-slate-50 flex flex-row items-center justify-between">
                    <div className="font-semibold text-sm text-black">
                      Position #{index + 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        className={inputClass}
                        value={job.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                      />
                      <Input
                        className={inputClass}
                        value={job.role}
                        onChange={(e) =>
                          updateExperience(index, "role", e.target.value)
                        }
                      />
                      <Input
                        className={inputClass}
                        value={job.startDate}
                        onChange={(e) =>
                          updateExperience(index, "startDate", e.target.value)
                        }
                      />
                      <Input
                        className={inputClass}
                        value={job.endDate}
                        onChange={(e) =>
                          updateExperience(index, "endDate", e.target.value)
                        }
                      />
                    </div>
                    <Textarea
                      value={job.description}
                      onChange={(e) =>
                        updateExperience(index, "description", e.target.value)
                      }
                      className="min-h-[100px] text-sm font-mono text-black border-slate-300"
                    />
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="space-y-4">
              <h3 className="font-bold text-black border-b pb-2">Education</h3>
              {data.education?.map((edu: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-3 p-3 border rounded-md bg-slate-50/50"
                >
                  <Input
                    className={inputClass}
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(index, "school", e.target.value)
                    }
                  />
                  <Input
                    className={inputClass}
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                  />
                </div>
              ))}
            </section>
          </div>
        </div>

        {/* RIGHT: PREVIEWER */}
        <div className="w-1/2 h-full bg-slate-800/5 p-8 flex justify-center items-start overflow-hidden">
          <div className="w-full h-full max-w-[21cm] shadow-2xl bg-white rounded-sm overflow-hidden">
            {previewData && <PdfPreview data={previewData} />}
          </div>
        </div>
      </div>
    </div>
  );
}
