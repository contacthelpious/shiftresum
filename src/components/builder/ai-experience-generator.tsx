
'use client';

import { useState } from 'react';
import { useFormContext, useWatch, UseFieldArrayAppend } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateExperienceDescriptionAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Plus, RefreshCw } from 'lucide-react';
import type { ResumeFormData, BulletPoint } from '@/lib/definitions';

interface AiExperienceGeneratorProps {
  experienceIndex: number;
  appendDescription: UseFieldArrayAppend<ResumeFormData, `experience.${number}.description`>;
}

export function AiExperienceGenerator({ experienceIndex, appendDescription }: AiExperienceGeneratorProps) {
  const { control } = useFormContext<ResumeFormData>();
  const { toast } = useToast();
  
  const [role, company] = useWatch({
    control,
    name: [`experience.${experienceIndex}.role`, `experience.${experienceIndex}.company`],
  });

  const [generatedBulletPoints, setGeneratedBulletPoints] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!role?.trim()) {
      toast({ variant: 'destructive', title: 'Role is empty', description: 'Please enter a job role to generate a description.' });
      return;
    }
    setIsGenerating(true);
    setGeneratedBulletPoints([]);
    const result = await generateExperienceDescriptionAction(role, company || '');
    if (result.success) {
      setGeneratedBulletPoints(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsGenerating(false);
  };
  
  const handleAccept = (bulletPoint: string) => {
    appendDescription({ id: crypto.randomUUID(), value: bulletPoint });
    toast({ title: 'Bullet Point Added', description: 'The AI-generated bullet point has been added.' });
    setGeneratedBulletPoints(prev => prev.filter(bp => bp !== bulletPoint));
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

        {generatedBulletPoints.length > 0 && (
          <div className="space-y-3 mt-3">
            {generatedBulletPoints.map((bullet, index) => (
              <div key={index} className="p-3 rounded-md bg-background border text-sm flex justify-between items-start gap-2">
                <p className="flex-1 whitespace-pre-wrap">{bullet}</p>
                <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => handleAccept(bullet)}>
                        <Plus />
                    </Button>
                     <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-600" onClick={() => {toast({title: "Coming soon!"})}}>
                        <RefreshCw />
                    </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
                <Button size="sm" variant="ghost" onClick={handleGenerate} disabled={isGenerating}>
                    <RefreshCw className="mr-2" /> Regenerate All
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
