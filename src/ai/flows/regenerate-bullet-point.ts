
'use server';

/**
 * @fileOverview Regenerates a resume bullet point for better impact.
 *
 * - regenerateBulletPoint - A function that rewrites a bullet point.
 * - RegenerateBulletPointInput - The input type for the function.
 * - RegenerateBulletPointOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateBulletPointInputSchema = z.object({
  role: z.string().describe('The job title or role.'),
  company: z.string().optional().describe('The company name.'),
  originalBullet: z.string().describe('The original bullet point to be improved.'),
});
export type RegenerateBulletPointInput = z.infer<
  typeof RegenerateBulletPointInputSchema
>;

const RegenerateBulletPointOutputSchema = z.object({
  newBulletPoint: z
    .string()
    .describe('An improved, more impactful version of the original bullet point.'),
});
export type RegenerateBulletPointOutput = z.infer<
  typeof RegenerateBulletPointOutputSchema
>;

export async function regenerateBulletPoint(
  input: RegenerateBulletPointInput
): Promise<RegenerateBulletPointOutput> {
  return regenerateBulletPointFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regenerateBulletPointPrompt',
  input: {schema: RegenerateBulletPointInputSchema},
  output: {schema: RegenerateBulletPointOutputSchema},
  prompt: `You are an expert resume writer. Rewrite the following bullet point to be more impactful and achievement-oriented. Use strong action verbs and quantify results where possible.

Job Context:
- Role: {{{role}}}
{{#if company}}- Company: {{{company}}}{{/if}}

Original Bullet Point:
"{{{originalBullet}}}"

Improved Bullet Point:`,
});

const regenerateBulletPointFlow = ai.defineFlow(
  {
    name: 'regenerateBulletPointFlow',
    inputSchema: RegenerateBulletPointInputSchema,
    outputSchema: RegenerateBulletPointOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
