import { z } from "zod"

export const resumeSchema = z.object({
  contact: z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email().or(z.literal("")),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
  }),
  summary: z.string().optional(),
  
  workExperience: z.array(
    z.object({
      id: z.string().optional(), // Optional because AI won't generate IDs
      company: z.string(),
      role: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      current: z.boolean(),
      description: z.string(),
    })
  ).optional(),

  education: z.array(
    z.object({
      id: z.string().optional(),
      school: z.string(),
      degree: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ).optional(),

  projects: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      description: z.string(),
      link: z.string().optional(),
    })
  ).optional(),

  skills: z.string().optional(),
})

export type ResumeFormValues = z.infer<typeof resumeSchema>