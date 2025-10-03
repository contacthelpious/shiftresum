'use server';

/**
 * @fileOverview Generates an initial resume draft based on a user-provided prompt.
 *
 * - generateInitialResumeDraft - A function that generates an initial resume draft.
 * - GenerateInitialResumeDraftInput - The input type for the generateInitialResumeDraft function.
 * - GenerateInitialResumeDraftOutput - The return type for the generateInitialResumeDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialResumeDraftInputSchema = z.object({
  prompt: z
    .string()
    .describe('A prompt describing the desired resume, including skills, experience, and job target.'),
});
export type GenerateInitialResumeDraftInput = z.infer<
  typeof GenerateInitialResumeDraftInputSchema
>;

const GenerateInitialResumeDraftOutputSchema = z.object({
  resumeDraft: z
    .string()
    .describe('The initial resume draft generated based on the prompt.'),
});
export type GenerateInitialResumeDraftOutput = z.infer<
  typeof GenerateInitialResumeDraftOutputSchema
>;

export async function generateInitialResumeDraft(
  input: GenerateInitialResumeDraftInput
): Promise<GenerateInitialResumeDraftOutput> {
  return generateInitialResumeDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialResumeDraftPrompt',
  input: {schema: GenerateInitialResumeDraftInputSchema},
  output: {schema: GenerateInitialResumeDraftOutputSchema},
  prompt: `You are an expert resume writer. Generate an initial resume draft based on the following prompt:\n\nPrompt: {{{prompt}}}\n\nResume Draft: `,
});

const generateInitialResumeDraftFlow = ai.defineFlow(
  {
    name: 'generateInitialResumeDraftFlow',
    inputSchema: GenerateInitialResumeDraftInputSchema,
    outputSchema: GenerateInitialResumeDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
