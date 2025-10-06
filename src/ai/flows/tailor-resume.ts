
'use server';

/**
 * @fileOverview Tailors a resume for a specific job description.
 *
 * - tailorResume - A function that rewrites resume data to align with a job description.
 * - TailorResumeInput - The input type for the function.
 * - TailorResumeOutput - The return type for the function (matches extraction output for pre-filling).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  ResumeFormSchema,
  ExtractResumeDataOutputSchema,
  type ExtractResumeDataOutput,
} from '@/lib/definitions';

const TailorResumeInputSchema = z.object({
  resumeData: ResumeFormSchema.describe('The current structured data of the user\'s resume.'),
  jobDescription: z.string().describe('The full text of the job description to tailor the resume for.'),
});
export type TailorResumeInput = z.infer<typeof TailorResumeInputSchema>;

// The output schema is the same as the extraction schema to reuse the pre-filling logic.
export type TailorResumeOutput = ExtractResumeDataOutput;

export async function tailorResume(
  input: TailorResumeInput
): Promise<TailorResumeOutput> {
  return tailorResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tailorResumePrompt',
  input: { schema: TailorResumeInputSchema },
  output: { schema: ExtractResumeDataOutputSchema },
  prompt: `You are an expert career coach and resume writer. Your task is to analyze the provided resume data and a specific job description, then rewrite the resume to be perfectly tailored for that job.

**Resume Data:**
\`\`\`json
{{{json resumeData}}}
\`\`\`

**Job Description:**
\`\`\`text
{{{jobDescription}}}
\`\`\`

**Your Instructions:**

1.  **Analyze Both Inputs:** Deeply understand the user's experience from the resume data and the key requirements, skills, and keywords from the job description.
2.  **Rewrite the Summary:** Craft a new, compelling summary that directly addresses the core requirements of the job, using language from the job description.
3.  **Optimize Experience Bullet Points:** For each work experience, rewrite the bullet points. Focus on highlighting achievements that are most relevant to the new role. Quantify results where possible and incorporate keywords from the job description naturally.
4.  **Curate Skills:** Adjust the skills section to prioritize skills mentioned in the job description. You may add relevant skills if they are clearly implied by the user's experience but were not explicitly listed.
5.  **Return Structured Data:** Output the completely new, tailored resume in the required structured JSON format. Ensure all original sections (projects, education, etc.) are carried over, even if they aren't modified.
`,
});

const tailorResumeFlow = ai.defineFlow(
  {
    name: 'tailorResumeFlow',
    inputSchema: TailorResumeInputSchema,
    outputSchema: ExtractResumeDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
