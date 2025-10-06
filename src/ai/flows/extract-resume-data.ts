
'use server';

/**
 * @fileOverview Extracts and structures resume data from raw text or a file.
 *
 * - extractResumeData - A function that parses a resume into a structured format.
 * - ExtractResumeDataInput - The input type for the function.
 * - ExtractResumeDataOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  ExtractResumeDataOutputSchema,
  type ExtractResumeDataOutput,
} from '@/lib/definitions';


const ExtractResumeDataInputSchema = z.object({
  resumeText: z.string().optional().describe('The full raw text content of a resume.'),
  resumeFileUri: z.string().optional().describe("A resume file as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ExtractResumeDataInput = z.infer<
  typeof ExtractResumeDataInputSchema
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
  prompt: `You are an expert resume parser. Analyze the following resume content and extract the information into a structured JSON object.
The resume content will be provided either as a raw text block or as a file. Prioritize the file if both are provided.

- For experience descriptions, each bullet point should be a separate string in the 'description' array.
- For skills, extract each distinct skill as a separate object.
- If a section (like projects or certifications) is not present, return an empty array for it.

{{#if resumeFileUri}}
Resume File:
{{media url=resumeFileUri}}
{{/if}}

{{#if resumeText}}
Resume Text:
{{{resumeText}}}
{{/if}}
`,
});

const extractResumeDataFlow = ai.defineFlow(
  {
    name: 'extractResumeDataFlow',
    inputSchema: ExtractResumeDataInputSchema,
    outputSchema: ExtractResumeDataOutputSchema,
  },
  async (input) => {
    if (!input.resumeText && !input.resumeFileUri) {
      throw new Error('Either resumeText or resumeFileUri must be provided.');
    }
    const { output } = await prompt(input);
    return output!;
  }
);
