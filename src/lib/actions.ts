'use server';

import { generateInitialResumeDraft } from '@/ai/flows/generate-initial-resume-draft';
import { generateResumeSuggestions } from '@/ai/flows/generate-resume-suggestions';
import { summarizeResume } from '@/ai/flows/summarize-resume';

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
