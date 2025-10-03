
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

export const ExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const EducationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().optional(),
  degree: z.string().optional(),
  graduationDate: z.string().optional(),
  details: z.string().optional(),
});

export type Education = z.infer<typeof EducationSchema>;

export const SkillSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const ProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CertificationSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    issuingOrganization: z.string().optional(),
    date: z.string().optional(),
});

export type Certification = z.infer<typeof CertificationSchema>;

export const ResumeDataSchema = z.object({
  personalInfo: PersonalInfoSchema.optional(),
  experience: z.array(ExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
  skills: z.array(SkillSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  certifications: z.array(CertificationSchema).optional(),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;

export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: 'A passionate Full-Stack Developer with experience in building web applications with React, Node.js, and modern cloud technologies. Eager to contribute to a challenging and innovative environment.',
  },
  experience: [
    {
      id: "1",
      company: 'Tech Solutions Inc.',
      role: 'Senior Software Engineer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: '- Led the development of a new client-facing dashboard using React and TypeScript.\\n- Optimized backend services, resulting in a 30% reduction in API response times.\\n- Mentored junior engineers and conducted code reviews.',
    },
  ],
  education: [
    {
      id: "1",
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      graduationDate: 'May 2017',
      details: 'GPA: 3.8/4.0, Magna Cum Laude',
    },
  ],
  skills: [
    { id: "1", name: 'JavaScript' },
    { id: "2", name: 'TypeScript' },
    { id: "3", name: 'React' },
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
