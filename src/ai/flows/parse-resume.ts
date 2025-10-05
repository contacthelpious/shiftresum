
'use server';

/**
 * @fileOverview Parses resume content and extracts structured data.
 * 
 * - parseResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PersonalInfoSchema, ExperienceSchema, EducationSchema, SkillSchema, ProjectSchema, CertificationSchema } from '@/lib/definitions';

const ParseResumeInputSchema = z.object({
  resumeContent: z.string().describe('The entire text content of a resume.'),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

// Define a clean, simple output schema for the AI model.
// This schema matches the application's internal data structure to prevent validation errors.
const ParseResumeOutputSchema = z.object({
  personalInfo: PersonalInfoSchema.default({}),
  experience: z.array(ExperienceSchema.extend({
      // The AI provides string descriptions, which will be converted to bullet points on the server.
      // IDs are generated on the server, so they are not required from the AI.
      id: z.string().optional(),
      description: z.array(z.string()).optional().default([]),
  })).default([]),
  education: z.array(EducationSchema.omit({ id: true })).default([]),
  skills: z.array(SkillSchema.omit({ id: true })).default([]),
  projects: z.array(ProjectSchema.omit({ id: true })).default([]),
  certifications: z.array(CertificationSchema.omit({ id: true })).default([]),
}).describe('The structured data extracted from the resume.');
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;


export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: { schema: ParseResumeInputSchema },
  output: { schema: ParseResumeOutputSchema },
  prompt: `You are an expert resume parser. Analyze the following resume content and extract as much structured information as possible. Provide the output in the requested JSON format.

For the 'experience' section, provide the 'description' as an array of strings, where each string is a single bullet point or responsibility.
If a section (like projects or certifications) is not present, return an empty array for that field.

Resume Content:
\`\`\`
{{{resumeContent}}}
\`\`\``,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
