
'use server';

import 'dotenv/config';
import { generateInitialResumeDraft } from '@/ai/flows/generate-initial-resume-draft';
import { generateResumeSuggestions } from '@/ai/flows/generate-resume-suggestions';
import { summarizeResume } from '@/ai/flows/summarize-resume';
import { parseResume } from '@/ai/flows/parse-resume';
import { defaultResumeFormData, ResumeFormSchema } from '@/lib/definitions';
import { merge } from 'lodash';
import mammoth from 'mammoth';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { generateSummaryFromPrompt } from '@/ai/flows/generate-summary-from-prompt';
import { generateExperienceDescription } from '@/ai/flows/generate-experience-description';
import { generateSkillsFromResume } from '@/ai/flows/generate-skills-from-resume';
import { regenerateBulletPoint } from '@/ai/flows/regenerate-bullet-point';

async function getFileContent(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.type === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
    }
    throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
}

export async function parseResumeAction(formData: FormData) {
    try {
        const file = formData.get('resume') as File;
        if (!file) {
            throw new Error('No file provided.');
        }
        
        const resumeContent = await getFileContent(file);
        
        if (!resumeContent.trim()) {
            throw new Error('The document appears to be empty.');
        }

        const parsedData = await parseResume({ resumeContent });
        
        // Create a clean data structure, starting with defaults.
        const fullData = merge({}, defaultResumeFormData, parsedData);
        
        // **THE FIX**: Rigorously sanitize and assign valid UUIDs to all items.
        // This ensures that any placeholder or invalid IDs from the AI are replaced.
        
        // Sanitize Experience section, including nested descriptions
        fullData.experience?.forEach(exp => {
            exp.id = crypto.randomUUID(); // Assign new valid UUID
            if (Array.isArray(exp.description)) {
                 // The AI returns an array of strings, transform it to the required object structure.
                exp.description = (exp.description as unknown as string[]).map((descValue: string) => ({
                    id: crypto.randomUUID(), // Assign new valid UUID to each bullet point
                    value: descValue,
                }));
            }
        });

        // Sanitize all other top-level array sections
        fullData.education?.forEach(item => { item.id = crypto.randomUUID() });
        fullData.skills?.forEach(item => { item.id = crypto.randomUUID() });
        fullData.projects?.forEach(item => { item.id = crypto.randomUUID() });
        fullData.certifications?.forEach(item => { item.id = crypto.randomUUID() });

        // Perform a final validation against the schema to be absolutely sure.
        const finalValidation = ResumeFormSchema.safeParse(fullData);
        
        if (!finalValidation.success) {
            console.error("Final validation failed after merging and sanitizing:", finalValidation.error.flatten());
            throw new Error(`Schema validation failed. Parse Errors:\n\n${JSON.stringify(finalValidation.error.flatten().fieldErrors, null, 2)}`);
        }

        return { success: true, data: finalValidation.data };
    } catch (error) {
        console.error('[Parse Resume Action Error]', error);
        const message = error instanceof Error ? error.message : 'Failed to parse resume.';
        return { success: false, error: message };
    }
}

export async function getInitialResumeDraftAction(prompt: string) {
    try {
        const result = await generateInitialResumeDraft({ prompt });
        return { success: true, data: result.resumeDraft };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate resume draft.' };
    }
}

export async function getResumeSuggestionsAction(resumeContent: string, jobDescription: string) {
    try {
        const result = await generateResumeSuggestions({ resumeContent, jobDescription });
        return { success: true, data: result.suggestions };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate suggestions.' };
    }
}

export async function summarizeResumeAction(resumeText: string) {
    try {
        const result = await summarizeResume({ resumeText });
        return { success: true, data: result.summary };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to summarize resume.' };
    }
}

export async function generateSummaryFromPromptAction(prompt: string) {
    try {
        const result = await generateSummaryFromPrompt({ prompt });
        return { success: true, data: result.summary };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate summary.' };
    }
}

export async function generateExperienceDescriptionAction(role: string, company: string) {
    try {
        const result = await generateExperienceDescription({ role, company });
        return { success: true, data: result.bulletPoints };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate description.' };
    }
}

export async function generateSkillsFromResumeAction(resumeContent: string) {
    try {
        const result = await generateSkillsFromResume({ resumeContent });
        return { success: true, data: result.skills };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate skills.' };
    }
}

export async function regenerateBulletPointAction(role: string, company: string | undefined, originalBullet: string) {
    try {
        const result = await regenerateBulletPoint({ role, company, originalBullet });
        return { success: true, data: result.newBulletPoint };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to regenerate bullet point.' };
    }
}
