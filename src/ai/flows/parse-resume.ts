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
import { ResumeDataSchema } from '@/lib/definitions';

const ParseResumeInputSchema = z.object({
  resumeContent: z.string().describe('The entire text content of a resume.'),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

const ParseResumeOutputSchema = ResumeDataSchema.deepPartial().describe(
  'The structured data extracted from the resume.'
);
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
