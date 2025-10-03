import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-resume-draft.ts';
import '@/ai/flows/generate-resume-suggestions.ts';
import '@/ai/flows/summarize-resume.ts';
import '@/ai/flows/parse-resume.ts';
