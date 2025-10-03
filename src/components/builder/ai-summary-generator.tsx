
'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { generateSummaryFromPromptAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Check, RefreshCw } from 'lucide-react';
import type { ResumeFormData } from '@/lib/definitions';

export function AiSummaryGenerator() {
  const { setValue } = useFormContext<ResumeFormData>();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a role or keyword.' });
      return;
    }
    setIsGenerating(true);
    setGeneratedSummary('');
    const result = await generateSummaryFromPromptAction(prompt);
    if (result.success) {
      setGeneratedSummary(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsGenerating(false);
  };
  
  const handleAccept = () => {
    setValue('personalInfo.summary', generatedSummary, { shouldDirty: true });
    toast({ title: 'Summary Updated', description: 'The AI-generated summary has been applied.' });
    setGeneratedSummary('');
    setPrompt('');
  };

  return (
    <Card className="bg-muted/30 border-dashed">
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
            <Sparkles className="h-5 w-5 text-accent shrink-0 mt-2" />
            <div>
                <h4 className="font-semibold text-sm">Generate Summary with AI</h4>
                <p className="text-xs text-muted-foreground">
                    Enter a job title or keywords to get started.
                </p>
            </div>
        </div>
        
        <div className="flex gap-2">
          <Input 
            placeholder="e.g., Senior Frontend Developer" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate'}
          </Button>
        </div>

        {generatedSummary && (
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-background border text-sm">
                {generatedSummary}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleAccept}>
                <Check className="mr-2" /> Accept
              </Button>
              <Button size="sm" variant="ghost" onClick={handleGenerate} disabled={isGenerating}>
                <RefreshCw className="mr-2" /> Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

