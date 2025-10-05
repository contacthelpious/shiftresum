
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

export const ReferenceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});
export type Reference = z.infer<typeof ReferenceSchema>;

export const AdditionalInformationSchema = z.object({
  details: z.string().optional(),
});
export type AdditionalInformation = z.infer<typeof AdditionalInformationSchema>;

export const SectionKeySchema = z.enum([
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'summary',
  'additionalInformation',
  'references',
]);

export type SectionKey = z.infer<typeof SectionKeySchema>;

// This is the shape of the data stored in Firestore
export const ResumeDataSchema = z.object({
  title: z.string().optional(),
  data: z.object({
    personalInfo: PersonalInfoSchema,
    experience: z.array(ExperienceSchema),
    education: z.array(EducationSchema),
    skills: z.array(SkillSchema),
    projects: z.array(ProjectSchema),
    certifications: z.array(CertificationSchema),
    references: z.array(ReferenceSchema),
    additionalInformation: AdditionalInformationSchema,
    sectionOrder: z.array(SectionKeySchema),
  }),
  design: z.object({
    template: z.enum(['modern', 'classic', 'executive', 'minimal', 'bold']).default('modern'),
    color: z.string().default('#2c3e50'), // default to primary color
    font: z.enum(['Inter', 'Roboto', 'Lato']).default('Inter'),
    alignment: z.enum(['left', 'center', 'right']).default('left'),
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
    references: z.array(ReferenceSchema),
    additionalInformation: AdditionalInformationSchema,
    sectionOrder: z.array(SectionKeySchema),
});
export type ResumeFormData = z.infer<typeof ResumeFormSchema>;


export const defaultResumeFormData: ResumeFormData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    website: 'johndoe.com',
    summary: 'A highly motivated and skilled software engineer with experience in building web applications.',
  },
  experience: [
    { id: crypto.randomUUID(), company: 'Tech Corp', role: 'Software Engineer', startDate: 'Jan 2020', endDate: 'Present', description: [{id: crypto.randomUUID(), value: 'Developed and maintained web applications using React and Node.js.'}] },
  ],
  education: [
     { id: crypto.randomUUID(), institution: 'State University', degree: 'B.S. in Computer Science', graduationDate: 'May 2019', details: '' },
  ],
  skills: [ {id: crypto.randomUUID(), name: 'React'}, {id: crypto.randomUUID(), name: 'Node.js'} ],
  projects: [],
  certifications: [],
  references: [],
  additionalInformation: {
    details: '',
  },
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'additionalInformation', 'references'],
};


export const DesignOptionsSchema = z.object({
  template: z.enum(['modern', 'classic', 'executive', 'minimal', 'bold']).default('modern'),
  color: z.string().default('#2c3e50'), // default to primary color
  font: z.enum(['Inter', 'Roboto', 'Lato']).default('Inter'),
  alignment: z.enum(['left', 'center', 'right']).default('left'),
});

export type DesignOptions = z.infer<typeof DesignOptionsSchema>;

export const defaultDesignOptions: DesignOptions = {
    template: 'modern',
    color: '#2c3e50',
    font: 'Inter',
    alignment: 'left',
};
