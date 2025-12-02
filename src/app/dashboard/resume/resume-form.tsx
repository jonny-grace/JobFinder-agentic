'use client'

import { useState, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resumeSchema, type ResumeFormValues } from "@/lib/schemas/resume"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Wand2, Save, Upload, Loader2 } from "lucide-react"
import { saveResume } from "./actions"
import { parseResumeFromPdf } from "./ai-actions"

// Default empty state
const defaultValues: ResumeFormValues = {
  contact: { fullName: "", email: "" },
  summary: "",
  workExperience: [],
  education: [],
  projects: [],
  skills: ""
}

export default function ResumeForm({ initialData }: { initialData?: ResumeFormValues | null }) {
  const [isSaving, setIsSaving] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form with DB data OR defaults
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || defaultValues
  })

  // Field Arrays
  const workArray = useFieldArray({ control: form.control, name: "workExperience" })
  const eduArray = useFieldArray({ control: form.control, name: "education" })
  const projArray = useFieldArray({ control: form.control, name: "projects" })

  async function onSubmit(data: ResumeFormValues) {
    setIsSaving(true)
    try {
      await saveResume(data)
      alert("✅ Saved successfully")
    } catch (error) {
      alert("❌ Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const extractedData = await parseResumeFromPdf(formData)
      form.reset(extractedData) // Fill form with AI data
      alert("✅ Resume imported!")
    } catch (error) {
      console.error(error)
      alert("❌ Failed to parse resume.")
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-black">Master Resume</h1>
          <p className="text-slate-600">Manage the core data used for all your applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf" 
            onChange={handleFileUpload} 
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isImporting}
            className="bg-black text-white hover:bg-slate-800 font-semibold"
          >
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Import PDF
          </Button>

          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSaving} 
            variant="outline"
            className="border-slate-300 text-black hover:bg-slate-100 font-semibold"
          >
            {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
          </Button>
        </div>
      </div>

      <form className="space-y-8">
        
        {/* 1. Contact Info */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-slate-700">Full Name</Label>
              <Input {...form.register("contact.fullName")} className="border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Email</Label>
              <Input {...form.register("contact.email")} className="border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Phone</Label>
              <Input {...form.register("contact.phone")} className="border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Location</Label>
              <Input {...form.register("contact.location")} className="border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">LinkedIn</Label>
              <Input {...form.register("contact.linkedin")} className="border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Portfolio / Website</Label>
              <Input {...form.register("contact.portfolio")} className="border-slate-300" />
            </div>
          </CardContent>
        </Card>

        {/* 2. Summary */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-slate-900">Professional Summary</CardTitle>
            <Button variant="ghost" size="sm" className="text-indigo-600 font-medium hover:bg-indigo-50">
              <Wand2 className="mr-2 h-4 w-4" /> Enhance with AI
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea 
              {...form.register("summary")} 
              className="min-h-[100px] border-slate-300" 
              placeholder="Senior Developer with 5+ years of experience..." 
            />
          </CardContent>
        </Card>

        {/* 3. Work Experience */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-semibold text-slate-900">Work Experience</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => workArray.append({ company: "New Company", role: "New Role", startDate: "", description: "", current: false })}>
              <Plus className="mr-2 h-4 w-4" /> Add Job
            </Button>
          </div>
          {workArray.fields.map((field, index) => (
            <Card key={field.id} className="border-slate-200 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                   <h4 className="font-semibold text-slate-800">Position #{index + 1}</h4>
                   <Button variant="ghost" size="sm" onClick={() => workArray.remove(index)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Job Title</Label>
                    <Input {...form.register(`workExperience.${index}.role`)} className="border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Company</Label>
                    <Input {...form.register(`workExperience.${index}.company`)} className="border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Start Date</Label>
                    <Input {...form.register(`workExperience.${index}.startDate`)} placeholder="YYYY-MM" className="border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">End Date</Label>
                    <Input {...form.register(`workExperience.${index}.endDate`)} placeholder="YYYY-MM or Present" className="border-slate-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Description</Label>
                  <Textarea {...form.register(`workExperience.${index}.description`)} className="min-h-[120px] border-slate-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 4. Education */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-semibold text-slate-900">Education</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => eduArray.append({ school: "", degree: "", startDate: "", endDate: "" })}>
              <Plus className="mr-2 h-4 w-4" /> Add School
            </Button>
          </div>
          {eduArray.fields.map((field, index) => (
             <Card key={field.id} className="border-slate-200 shadow-sm">
               <CardContent className="pt-6 grid gap-4 md:grid-cols-2">
                  <div className="col-span-2 flex justify-between">
                    <h4 className="font-semibold text-slate-800">School #{index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => eduArray.remove(index)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">School / University</Label>
                    <Input {...form.register(`education.${index}.school`)} className="border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Degree / Certificate</Label>
                    <Input {...form.register(`education.${index}.degree`)} className="border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Start Date</Label>
                    <Input {...form.register(`education.${index}.startDate`)} placeholder="YYYY-MM" className="border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">End Date</Label>
                    <Input {...form.register(`education.${index}.endDate`)} placeholder="YYYY-MM" className="border-slate-300" />
                  </div>
               </CardContent>
             </Card>
          ))}
        </div>

        {/* 5. Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-semibold text-slate-900">Projects</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => projArray.append({ name: "", description: "", link: "" })}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </div>
          {projArray.fields.map((field, index) => (
            <Card key={field.id} className="border-slate-200 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between">
                    <h4 className="font-semibold text-slate-800">Project #{index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => projArray.remove(index)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Project Name</Label>
                    <Input {...form.register(`projects.${index}.name`)} className="border-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Link</Label>
                    <Input {...form.register(`projects.${index}.link`)} placeholder="https://github.com/..." className="border-slate-300" />
                  </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-slate-700">Description</Label>
                   <Textarea {...form.register(`projects.${index}.description`)} className="border-slate-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 6. Skills */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              {...form.register("skills")} 
              className="border-slate-300" 
              placeholder="React, Node.js, Python, AWS..." 
            />
          </CardContent>
        </Card>
      </form>
    </div>
  )
}