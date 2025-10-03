
'use client';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateExperienceDescriptionAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Check, RefreshCw } from 'lucide-react';
import type { ResumeFormData } from '@/lib/definitions';

interface AiExperienceGeneratorProps {
  index: number;
}

export function AiExperienceGenerator({ index }: AiExperienceGeneratorProps) {
  const { control, setValue } = useFormContext<ResumeFormData>();
  const { toast } = useToast();
  
  const [role, company] = useWatch({
    control,
    name: [`experience.${index}.role`, `experience.${index}.company`],
  });

  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!role?.trim()) {
      toast({ variant: 'destructive', title: 'Role is empty', description: 'Please enter a job role to generate a description.' });
      return;
    }
    setIsGenerating(true);
    setGeneratedDescription('');
    const result = await generateExperienceDescriptionAction(role, company || '');
    if (result.success) {
      setGeneratedDescription(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsGenerating(false);
  };
  
  const handleAccept = () => {
    setValue(`experience.${index}.description`, generatedDescription, { shouldDirty: true });
    toast({ title: 'Description Updated', description: 'The AI-generated description has been applied.' });
    setGeneratedDescription('');
  };

  return (
    <Card className="bg-muted/30 border-dashed">
      <CardContent className="p-3">
         <div className="flex justify-between items-center">
            <div className="flex gap-2">
                <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-sm">Generate Description</h4>
                    <p className="text-xs text-muted-foreground">Uses Role and Company to generate bullet points.</p>
                </div>
            </div>
            <Button size="sm" onClick={handleGenerate} disabled={isGenerating || !role}>
                {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate'}
            </Button>
        </div>

        {generatedDescription && (
          <div className="space-y-2 mt-3">
            <div className="p-3 rounded-md bg-background border text-sm whitespace-pre-wrap">
                {generatedDescription}
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
