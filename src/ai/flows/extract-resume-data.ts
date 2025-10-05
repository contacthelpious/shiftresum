
'use server';

/**
 * @fileOverview Extracts and structures resume data from raw text.
 *
 * - extractResumeData - A function that parses resume text into a structured format.
 * - ExtractResumeDataInput - The input type for the function.
 * - ExtractResumeDataOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  PersonalInfoSchema,
  ExperienceSchema,
  EducationSchema,
  SkillSchema,
  ProjectSchema,
  CertificationSchema,
  ReferenceSchema,
} from '@/lib/definitions';

const ExtractResumeDataInputSchema = z.object({
  resumeText: z.string().describe('The full raw text content of a resume.'),
});
export type ExtractResumeDataInput = z.infer<
  typeof ExtractResumeDataInputSchema
>;

// We have to redefine the schemas here without the .uuid() for AI to work correctly
// as the AI doesn't know how to generate UUIDs.
const AiExperienceSchema = ExperienceSchema.omit({ id: true, description: true }).extend({
  description: z.array(z.string()).optional().describe('An array of bullet points describing the experience.'),
});
const AiEducationSchema = EducationSchema.omit({ id: true });
const AiSkillSchema = SkillSchema.omit({ id: true });
const AiProjectSchema = ProjectSchema.omit({ id: true });
const AiCertificationSchema = CertificationSchema.omit({ id: true });
const AiReferenceSchema = ReferenceSchema.omit({ id: true });

const ExtractResumeDataOutputSchema = z.object({
  personalInfo: PersonalInfoSchema.describe('The personal contact information from the resume.'),
  experience: z.array(AiExperienceSchema).describe('The work experience section of the resume.'),
  education: z.array(AiEducationSchema).describe('The education section of the resume.'),
  skills: z.array(AiSkillSchema).describe('The skills section of the resume.'),
  projects: z.array(AiProjectSchema).describe('The projects section of the resume.'),
  certifications: z.array(AiCertificationSchema).describe('The certifications section of the resume.'),
  references: z.array(AiReferenceSchema).describe('The references section of the resume.'),
});
export type ExtractResumeDataOutput = z.infer<
  typeof ExtractResumeDataOutputSchema
>;

export async function extractResumeData(
  input: ExtractResumeDataInput
): Promise<ExtractResumeDataOutput> {
  return extractResumeDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractResumeDataPrompt',
  input: { schema: ExtractResumeDataInputSchema },
  output: { schema: ExtractResumeDataOutputSchema },
  prompt: `You are an expert resume parser. Analyze the following resume text and extract the information into a structured JSON object.

- For experience descriptions, each bullet point should be a separate string in the 'description' array.
- For skills, extract each distinct skill as a separate object.
- If a section (like projects or certifications) is not present, return an empty array for it.

Resume Text:
{{{resumeText}}}
`,
});

const extractResumeDataFlow = ai.defineFlow(
  {
    name: 'extractResumeDataFlow',
    inputSchema: ExtractResumeDataInputSchema,
    outputSchema: ExtractResumeDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
