
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
import { tailorResume } from '@/ai/flows/tailor-resume';
import type { ResumeFormData } from './definitions';
import mammoth from 'mammoth';

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
        let structuredData;

        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            const rawText = result.value;
             if (!rawText.trim()) {
                return { success: false, error: 'Could not extract text from the document.' };
            }
            structuredData = await extractResumeData({ resumeText: rawText });
        } else if (file.type === 'application/pdf') {
            const dataUri = `data:application/pdf;base64,${buffer.toString('base64')}`;
            structuredData = await extractResumeData({ resumeFileUri: dataUri });
        } else {
            return { success: false, error: 'Unsupported file type. Please upload a DOCX or PDF file.' };
        }

        return { success: true, data: structuredData };
    } catch (error) {
        console.error('Error processing resume:', error);
        return { success: false, error: 'Failed to process the uploaded resume.' };
    }
}


export async function tailorResumeAction(resumeData: ResumeFormData, jobDescription: string) {
    try {
        const result = await tailorResume({ resumeData, jobDescription });
        return { success: true, data: result };
    } catch (error) {
        console.error('Error tailoring resume:', error);
        return { success: false, error: 'Failed to tailor the resume with AI.' };
    }
}
