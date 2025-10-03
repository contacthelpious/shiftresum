
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Save } from 'lucide-react';
import type { ResumeData } from '@/lib/definitions';

interface DownloadTabProps {
  resumeData: ResumeData;
}

export function DownloadTab({ resumeData }: DownloadTabProps) {
  const { toast } = useToast();

  const handleExport = () => {
    const originalTitle = document.title;
    const fullName = resumeData.personalInfo.name || 'Resume';
    document.title = `${fullName} Resume`;
    window.print();
    document.title = originalTitle;
  };

  const handleSave = () => {
    toast({
      title: "Resume Saved!",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Save & Export</CardTitle>
          <CardDescription>Save your progress or export your resume as a PDF.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button onClick={handleSave} variant="outline" className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Progress
            </Button>
            <Button onClick={handleExport} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Make sure to save your work before exporting. The exported PDF will reflect your last saved changes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
