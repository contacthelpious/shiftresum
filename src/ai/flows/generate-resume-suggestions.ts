'use server';

/**
 * @fileOverview AI-powered resume suggestion generator.
 *
 * - generateResumeSuggestions - A function that generates resume improvement suggestions.
 * - GenerateResumeSuggestionsInput - The input type for the generateResumeSuggestions function.
 * - GenerateResumeSuggestionsOutput - The return type for the generateResumeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeSuggestionsInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The content of the resume to generate suggestions for.'),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description the resume will be used for.'),
});
export type GenerateResumeSuggestionsInput = z.infer<
  typeof GenerateResumeSuggestionsInputSchema
>;

const GenerateResumeSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-powered suggestions for improving the resume content, including rewording for clarity, suggesting relevant keywords, and identifying areas for improvement.'),
});
export type GenerateResumeSuggestionsOutput = z.infer<
  typeof GenerateResumeSuggestionsOutputSchema
>;

export async function generateResumeSuggestions(
  input: GenerateResumeSuggestionsInput
): Promise<GenerateResumeSuggestionsOutput> {
  return generateResumeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeSuggestionsPrompt',
  input: {schema: GenerateResumeSuggestionsInputSchema},
  output: {schema: GenerateResumeSuggestionsOutputSchema},
  prompt: `You are an AI resume expert. You will be provided with resume content and a job description. You will provide suggestions on how to improve the resume content to better match the job description. Your suggestions should include rewording for clarity, suggesting relevant keywords, and identifying areas for improvement.

Resume Content: {{{resumeContent}}}
Job Description: {{{jobDescription}}}

Suggestions:`,
});

const generateResumeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateResumeSuggestionsFlow',
    inputSchema: GenerateResumeSuggestionsInputSchema,
    outputSchema: GenerateResumeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
