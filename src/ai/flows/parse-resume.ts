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

const ParseResumeInputSchema = z.object({
  resumeContent: z.string().describe('The entire text content of a resume.'),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

// The output should be a partial structure of the resume data,
// as not all fields may be present in every resume.
export const ParseResumeOutputSchema = z.object({
    personalInfo: z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      website: z.string().optional(),
      summary: z.string().optional(),
    }).optional(),
    experience: z.array(z.object({
      company: z.string().optional(),
      role: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
      institution: z.string().optional(),
      degree: z.string().optional(),
      graduationDate: z.string().optional(),
      details: z.string().optional(),
    })).optional(),
    skills: z.array(z.object({
      name: z.string().optional(),
    })).optional(),
    projects: z.array(z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      link: z.string().optional(),
    })).optional(),
    certifications: z.array(z.object({
      name: z.string().optional(),
      issuingOrganization: z.string().optional(),
      date: z.string().optional(),
    })).optional(),
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

If a section (like projects or certifications) is not present, omit it from the output. For descriptions, maintain the original line breaks.

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
