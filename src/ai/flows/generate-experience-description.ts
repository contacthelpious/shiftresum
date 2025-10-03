
'use server';

/**
 * @fileOverview Generates a job experience description from a role and company.
 *
 * - generateExperienceDescription - A function that generates a job description.
 * - GenerateExperienceDescriptionInput - The input type for the function.
 * - GenerateExperienceDescriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExperienceDescriptionInputSchema = z.object({
  role: z
    .string()
    .describe('The job title or role, e.g., "Software Engineer".'),
  company: z
    .string()
    .optional()
    .describe('The company name, e.g., "Google".'),
});
export type GenerateExperienceDescriptionInput = z.infer<
  typeof GenerateExperienceDescriptionInputSchema
>;

const GenerateExperienceDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('3-4 bullet points describing responsibilities and achievements for the role. Each bullet point should start with a hyphen.'),
});
export type GenerateExperienceDescriptionOutput = z.infer<
  typeof GenerateExperienceDescriptionOutputSchema
>;

export async function generateExperienceDescription(
  input: GenerateExperienceDescriptionInput
): Promise<GenerateExperienceDescriptionOutput> {
  return generateExperienceDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExperienceDescriptionPrompt',
  input: {schema: GenerateExperienceDescriptionInputSchema},
  output: {schema: GenerateExperienceDescriptionOutputSchema},
  prompt: `You are an expert resume writer. For the job role of "{{{role}}}"{{#if company}} at "{{{company}}}"{{/if}}, generate 3-4 impactful bullet points for a resume. Start each bullet point with a hyphen. Focus on achievements and quantifiable results.

Role: {{{role}}}
{{#if company}}Company: {{{company}}}{{/if}}
`,
});

const generateExperienceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateExperienceDescriptionFlow',
    inputSchema: GenerateExperienceDescriptionInputSchema,
    outputSchema: GenerateExperienceDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
