
import { z } from 'zod';

export const PersonalInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;

export const BulletPointSchema = z.object({
  id: z.string().uuid(),
  value: z.string(),
});
export type BulletPoint = z.infer<typeof BulletPointSchema>;

export const ExperienceSchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.array(BulletPointSchema),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const EducationSchema = z.object({
  id: z.string().uuid().optional(),
  institution: z.string().optional(),
  degree: z.string().optional(),
  graduationDate: z.string().optional(),
  details: z.string().optional(),
});

export type Education = z.infer<typeof EducationSchema>;

export const SkillSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CertificationSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().optional(),
    issuingOrganization: z.string().optional(),
    date: z.string().optional(),
});

export type Certification = z.infer<typeof CertificationSchema>;

// This is the shape of the data stored in Firestore
export const ResumeDataSchema = z.object({
  title: z.string().optional(),
  data: z.object({
    personalInfo: PersonalInfoSchema.optional(),
    experience: z.array(ExperienceSchema).optional(),
    education: z.array(EducationSchema).optional(),
    skills: z.array(SkillSchema).optional(),
    projects: z.array(ProjectSchema).optional(),
    certifications: z.array(CertificationSchema).optional(),
  }),
  design: z.object({
    template: z.enum(['modern', 'classic', 'compact', 'professional', 'creative']).default('modern'),
    color: z.string().default('#2c3e50'), // default to primary color
    font: z.enum(['Inter', 'Roboto', 'Lato']).default('Inter'),
  }),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;

// This is the shape of the form data in the UI
export const ResumeFormSchema = z.object({
    personalInfo: PersonalInfoSchema,
    experience: z.array(ExperienceSchema),
    education: z.array(EducationSchema),
    skills: z.array(SkillSchema),
    projects: z.array(ProjectSchema),
    certifications: z.array(CertificationSchema),
});
export type ResumeFormData = z.infer<typeof ResumeFormSchema>;


export const defaultResumeFormData: ResumeFormData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    website: 'johndoe.com',
    summary: 'A passionate Full-Stack Developer with experience in building web applications with React, Node.js, and modern cloud technologies. Eager to contribute to a challenging and innovative environment.',
  },
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Tech Solutions Inc.',
      role: 'Senior Software Engineer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: [
        { id: crypto.randomUUID(), value: 'Led the development of a new client-facing dashboard using React and TypeScript.' },
        { id: crypto.randomUUID(), value: 'Optimized backend services, resulting in a 30% reduction in API response times.' },
        { id: crypto.randomUUID(), value: 'Mentored junior engineers and conducted code reviews.' },
      ]
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      graduationDate: 'May 2017',
      details: 'GPA: 3.8/4.0, Magna Cum Laude',
    },
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'JavaScript' },
    { id: crypto.randomUUID(), name: 'TypeScript' },
    { id: crypto.randomUUID(), name: 'React' },
  ],
  projects: [],
  certifications: [],
};


export const DesignOptionsSchema = z.object({
  template: z.enum(['modern', 'classic', 'compact', 'professional', 'creative']).default('modern'),
  color: z.string().default('#2c3e50'), // default to primary color
  font: z.enum(['Inter', 'Roboto', 'Lato']).default('Inter'),
});

export type DesignOptions = z.infer<typeof DesignOptionsSchema>;

export const defaultDesignOptions: DesignOptions = {
    template: 'modern',
    color: '#2c3e50',
    font: 'Inter'
};
