
'use server';

/**
 * @fileOverview Generates a resume summary from a simple prompt.
 *
 * - generateSummaryFromPrompt - A function that generates a resume summary.
 * - GenerateSummaryFromPromptInput - The input type for the function.
 * - GenerateSummaryFromPromptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSummaryFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe('A short prompt, usually a job title or keywords, e.g., "Senior Frontend Developer".'),
});
export type GenerateSummaryFromPromptInput = z.infer<
  typeof GenerateSummaryFromPromptInputSchema
>;

const GenerateSummaryFromPromptOutputSchema = z.object({
  summary: z
    .string()
    .describe('A professional, 2-3 sentence resume summary based on the prompt.'),
});
export type GenerateSummaryFromPromptOutput = z.infer<
  typeof GenerateSummaryFromPromptOutputSchema
>;

export async function generateSummaryFromPrompt(
  input: GenerateSummaryFromPromptInput
): Promise<GenerateSummaryFromPromptOutput> {
  return generateSummaryFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryFromPrompt',
  input: {schema: GenerateSummaryFromPromptInputSchema},
  output: {schema: GenerateSummaryFromPromptOutputSchema},
  prompt: `You are an expert resume writer. Based on the following prompt, write a compelling and professional resume summary that is 2-3 sentences long.

Prompt: {{{prompt}}}`,
});

const generateSummaryFromPromptFlow = ai.defineFlow(
  {
    name: 'generateSummaryFromPromptFlow',
    inputSchema: GenerateSummaryFromPromptInputSchema,
    outputSchema: GenerateSummaryFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
