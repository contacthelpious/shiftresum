'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getResumeSuggestionsAction, getInitialResumeDraftAction, summarizeResumeAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Sparkles, Loader2, FileText } from 'lucide-react';
import type { ResumeData } from '@/lib/definitions';

export function AiAssistant() {
  const { setValue } = useFormContext<ResumeData>();
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const getResumeText = () => document.getElementById('resume-preview-content')?.innerText || '';

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    setSuggestions('');
    const resumeContent = getResumeText();

    if (!resumeContent.trim()) {
      toast({ variant: 'destructive', title: 'Resume is empty', description: 'Please add some content to your resume first.' });
      setIsGenerating(false);
      return;
    }

    const result = await getResumeSuggestionsAction(resumeContent, jobDescription);
    if (result.success) {
      setSuggestions(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsGenerating(false);
  };
  
  const handleGenerateDraft = async () => {
    if (!prompt) {
        toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please describe the resume you want to create.' });
        return;
    }
    setIsDrafting(true);
    const result = await getInitialResumeDraftAction(prompt);
    if (result.success) {
      // This is a naive implementation. A real app would parse the markdown into the form fields.
      // For now, we'll just put it in the summary and show a toast.
      setValue('personalInfo.summary', result.data);
      toast({ title: 'Draft Generated!', description: 'The summary has been updated with the AI-generated draft.' });
    } else {
       toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsDrafting(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary('');
    const resumeText = getResumeText();

    if (!resumeText.trim()) {
      toast({ variant: 'destructive', title: 'Resume is empty', description: 'Please add some content to your resume first.' });
      setIsSummarizing(false);
      return;
    }

    const result = await summarizeResumeAction(resumeText);
    if (result.success) {
        setSummary(result.data);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsSummarizing(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Draft with AI</CardTitle>
          <CardDescription>Describe your experience, and let AI generate a starting point.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="ai-prompt">Your prompt</Label>
          <Textarea 
            id="ai-prompt" 
            placeholder="e.g., A senior frontend developer with 5 years of experience in React and TypeScript..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={handleGenerateDraft} disabled={isDrafting}>
            {isDrafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Draft
          </Button>
        </CardContent>
      </Card>
    
      <Card>
        <CardHeader>
          <CardTitle>Improve for a Job</CardTitle>
          <CardDescription>Paste a job description to get tailored suggestions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <Button onClick={handleGenerateSuggestions} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Get Suggestions
          </Button>
          {suggestions && (
            <Card className="bg-muted/50 mt-4">
              <CardHeader><CardTitle className="text-base">Suggestions</CardTitle></CardHeader>
              <CardContent className="text-sm whitespace-pre-wrap font-sans">{suggestions}</CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Generate Summary</CardTitle>
            <CardDescription>Create a concise summary of your current resume.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button onClick={handleSummarize} disabled={isSummarizing}>
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                Summarize Resume
            </Button>
            {summary && (
                 <Card className="bg-muted/50 mt-4">
                 <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
                 <CardContent className="text-sm whitespace-pre-wrap font-sans">{summary}</CardContent>
               </Card>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
