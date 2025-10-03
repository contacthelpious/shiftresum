
'use server';

/**
 * @fileOverview Extracts relevant skills from resume content.
 *
 * - generateSkillsFromResume - A function that generates skills.
 * - GenerateSkillsFromResumeInput - The input type for the function.
 * - GenerateSkillsFromResumeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSkillsFromResumeInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The summary and work experience sections of a resume.'),
});
export type GenerateSkillsFromResumeInput = z.infer<
  typeof GenerateSkillsFromResumeInputSchema
>;

const GenerateSkillsFromResumeOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of 8-10 relevant technical and soft skills based on the resume content. Do not include skills that are too generic like "Teamwork".'),
});
export type GenerateSkillsFromResumeOutput = z.infer<
  typeof GenerateSkillsFromResumeOutputSchema
>;

export async function generateSkillsFromResume(
  input: GenerateSkillsFromResumeInput
): Promise<GenerateSkillsFromResumeOutput> {
  return generateSkillsFromResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSkillsFromResumePrompt',
  input: {schema: GenerateSkillsFromResumeInputSchema},
  output: {schema: GenerateSkillsFromResumeOutputSchema},
  prompt: `You are an expert resume analyst. Based on the provided resume content (summary and experience), extract a list of 8-10 of the most important hard and soft skills. Focus on specific, marketable skills.

Resume Content:
{{{resumeContent}}}
`,
});

const generateSkillsFromResumeFlow = ai.defineFlow(
  {
    name: 'generateSkillsFromResumeFlow',
    inputSchema: GenerateSkillsFromResumeInputSchema,
    outputSchema: GenerateSkillsFromResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
