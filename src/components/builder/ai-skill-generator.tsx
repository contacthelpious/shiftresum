
'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray, useWatch, UseFieldArrayAppend } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateSkillsFromResumeAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, RefreshCw, PlusCircle } from 'lucide-react';
import type { ResumeFormData, Skill } from '@/lib/definitions';

interface AiSkillGeneratorProps {
  append: UseFieldArrayAppend<ResumeFormData, "skills">;
}

export function AiSkillGenerator({ append }: AiSkillGeneratorProps) {
  const { control, getValues } = useFormContext<ResumeFormData>();
  const { toast } = useToast();

  const [generatedSkills, setGeneratedSkills] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentSkills = useWatch({ control, name: 'skills' }) || [];
  const currentSkillNames = new Set(currentSkills.map(s => s.name?.toLowerCase()));

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedSkills([]);

    const { personalInfo, experience } = getValues();
    const resumeContext = `
      Summary: ${personalInfo.summary || ''}
      Experience: ${experience.map(exp => `${exp.role} at ${exp.company}: ${exp.description}`).join('\n\n')}
    `;
    
    if (!resumeContext.trim()) {
        toast({ variant: 'destructive', title: 'Not enough content', description: 'Add a summary or work experience to generate skills.' });
        setIsGenerating(false);
        return;
    }

    const result = await generateSkillsFromResumeAction(resumeContext);

    if (result.success) {
      setGeneratedSkills(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsGenerating(false);
  };

  const handleAddSkill = (skillName: string) => {
    if (currentSkillNames.has(skillName.toLowerCase())) {
        toast({ title: 'Skill already exists', description: `"${skillName}" is already in your skills list.`});
        return;
    }
    append({ id: crypto.randomUUID(), name: skillName });
    toast({ title: 'Skill Added', description: `"${skillName}" has been added to your skills.`});
  };

  return (
    <Card className="bg-muted/30 border-dashed mt-4">
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
          <Sparkles className="h-5 w-5 text-accent shrink-0 mt-2" />
          <div>
            <h4 className="font-semibold text-sm">Generate Skills with AI</h4>
            <p className="text-xs text-muted-foreground">
              Suggests skills based on your summary and experience.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate Suggestions'}
          </Button>
          {generatedSkills.length > 0 && (
             <Button size="sm" variant="ghost" onClick={handleGenerate} disabled={isGenerating}>
                <RefreshCw className="mr-2" /> Regenerate
            </Button>
          )}
        </div>

        {generatedSkills.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Click a skill to add it to your list.</p>
            <div className="flex flex-wrap gap-2">
              {generatedSkills.map((skill, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-background"
                  onClick={() => handleAddSkill(skill)}
                  disabled={currentSkillNames.has(skill.toLowerCase())}
                >
                  <PlusCircle className="mr-2" />
                  {skill}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
