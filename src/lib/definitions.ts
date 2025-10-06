
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


// Schemas for AI Data Extraction (without UUIDs for AI generation)
export const AiExperienceSchema = ExperienceSchema.omit({ id: true, description: true }).extend({
  description: z.array(z.string()).optional().describe('An array of bullet points describing the experience.'),
});
export const AiEducationSchema = EducationSchema.omit({ id: true });
export const AiSkillSchema = SkillSchema.omit({ id: true });
export const AiProjectSchema = ProjectSchema.omit({ id: true });
export const AiCertificationSchema = CertificationSchema.omit({ id: true });
export const AiReferenceSchema = ReferenceSchema.omit({ id: true });

export const ExtractResumeDataOutputSchema = z.object({
  personalInfo: PersonalInfoSchema.describe('The personal contact information from the resume.'),
  experience: z.array(AiExperienceSchema).describe('The work experience section of the resume.'),
  education: z.array(AiEducationSchema).describe('The education section of the resume.'),
  skills: z.array(AiSkillSchema).describe('The skills section of the resume.'),
  projects: z.array(AiProjectSchema).describe('The projects section of the resume.'),
  certifications: z.array(AiCertificationSchema).describe('The certifications section of the resume.'),
  references: z.array(AiReferenceSchema).describe('The references section of the resume.'),
});
export type ExtractResumeDataOutput = z.infer<typeof ExtractResumeDataOutputSchema>;


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

export const TemplateNameSchema = z.enum([
  'modern', 
  'classic', 
  'executive', 
  'bold',
  'professional',
  'focus',
]);
export type TemplateName = z.infer<typeof TemplateNameSchema>;

export const FontSchema = z.enum(['Inter', 'Roboto', 'Lato', 'Georgia', 'Garamond', 'Verdana']);
export type Font = z.infer<typeof FontSchema>;

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
    additionalInformation: AdditionalInformationSchema.optional(),
    sectionOrder: z.array(SectionKeySchema).optional(),
  }),
  design: z.object({
    template: TemplateNameSchema.default('modern'),
    color: z.string().default('#2c3e50'), // default to primary color
    font: FontSchema.default('Inter'),
    fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
    lineHeight: z.enum(['compact', 'standard', 'relaxed']).default('standard'),
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
    additionalInformation: AdditionalInformationSchema.optional(),
    sectionOrder: z.array(SectionKeySchema).optional(),
});
export type ResumeFormData = z.infer<typeof ResumeFormSchema>;


export const defaultResumeFormData: ResumeFormData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  references: [],
  additionalInformation: {
    details: '',
  },
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'additionalInformation', 'references'],
};


export const DesignOptionsSchema = z.object({
  template: TemplateNameSchema.default('modern'),
  color: z.string().default('#2c3e50'), // default to primary color
  font: FontSchema.default('Inter'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  lineHeight: z.enum(['compact', 'standard', 'relaxed']).default('standard'),
  alignment: z.enum(['left', 'center', 'right']).default('left'),
});

export type DesignOptions = z.infer<typeof DesignOptionsSchema>;

export const defaultDesignOptions: DesignOptions = {
    template: 'modern',
    color: '#2c3e50',
    font: 'Inter',
    fontSize: 'medium',
    lineHeight: 'standard',
    alignment: 'left',
};
