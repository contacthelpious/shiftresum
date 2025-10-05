
'use server';

import 'dotenv/config';
import { generateInitialResumeDraft } from '@/ai/flows/generate-initial-resume-draft';
import { generateResumeSuggestions } from '@/ai/flows/generate-resume-suggestions';
import { summarizeResume } from '@/ai/flows/summarize-resume';
import { generateSummaryFromPrompt } from '@/ai/flows/generate-summary-from-prompt';
import { generateExperienceDescription } from '@/ai/flows/generate-experience-description';
import { generateSkillsFromResume } from '@/ai/flows/generate-skills-from-resume';
import { regenerateBulletPoint } from '@/ai/flows/regenerate-bullet-point';
import { extractResumeData } from '@/ai/flows/extract-resume-data';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

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

export async function uploadResumeAndExtractDataAction(formData: FormData) {
    const file = formData.get('resume') as File | null;
    if (!file) {
        return { success: false, error: 'No file uploaded.' };
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        let rawText = '';

        if (file.type === 'application/pdf') {
            const data = await pdf(buffer);
            rawText = data.text;
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            rawText = result.value;
        } else {
            return { success: false, error: 'Unsupported file type. Please upload a PDF or DOCX file.' };
        }

        if (!rawText.trim()) {
            return { success: false, error: 'Could not extract text from the document.' };
        }

        const structuredData = await extractResumeData({ resumeText: rawText });
        return { success: true, data: structuredData };
    } catch (error) {
        console.error('Error processing resume:', error);
        return { success: false, error: 'Failed to process the uploaded resume.' };
    }
}
