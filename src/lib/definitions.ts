import { z } from 'zod';

export const PersonalInfoSchema = z.object({
  name: z.string().default(''),
  email: z.string().email({ message: "Invalid email format." }).or(z.literal('')).default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  website: z.string().url({ message: "Invalid URL format." }).or(z.literal('')).default(''),
  summary: z.string().default(''),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;

export const ExperienceSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  company: z.string().default(''),
  role: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  description: z.string().default(''),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const EducationSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  institution: z.string().default(''),
  degree: z.string().default(''),
  graduationDate: z.string().default(''),
  details: z.string().default(''),
});

export type Education = z.infer<typeof EducationSchema>;

export const SkillSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().default(''),
});

export type Skill = z.infer<typeof SkillSchema>;

export const ProjectSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().default(''),
  description: z.string().default(''),
  link: z.string().url({ message: "Invalid URL format." }).or(z.literal('')).default(''),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CertificationSchema = z.object({
    id: z.string().default(() => crypto.randomUUID()),
    name: z.string().default(''),
    issuingOrganization: z.string().default(''),
    date: z.string().default(''),
});

export type Certification = z.infer<typeof CertificationSchema>;

export const ResumeDataSchema = z.object({
  personalInfo: PersonalInfoSchema.default({}),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;

export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    summary: 'A passionate Full-Stack Developer with experience in building web applications with React, Node.js, and modern cloud technologies. Eager to contribute to a challenging and innovative environment.',
  },
  experience: [
    {
      id: "1",
      company: 'Tech Solutions Inc.',
      role: 'Senior Software Engineer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: '- Led the development of a new client-facing dashboard using React and TypeScript.\n- Optimized backend services, resulting in a 30% reduction in API response times.\n- Mentored junior engineers and conducted code reviews.',
    },
    {
      id: "2",
      company: 'Innovate LLC',
      role: 'Software Engineer',
      startDate: 'Jun 2017',
      endDate: 'Dec 2019',
      description: '- Developed and maintained features for a large-scale e-commerce platform.\n- Collaborated with cross-functional teams to define and ship new features.',
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
    { id: "4", name: 'Node.js' },
    { id: "5", name: 'SQL' },
    { id: "6", name: 'Docker' },
    { id: "7", name: 'AWS' },
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