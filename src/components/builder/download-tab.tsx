'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Save } from 'lucide-react';
import type { ResumeData } from '@/lib/definitions';
import { AuthGate } from './auth-gate';
import { useUser } from '@/firebase';

interface DownloadTabProps {
  resumeData: ResumeData;
}

export function DownloadTab({ resumeData }: DownloadTabProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);

  // This is a placeholder. In a real app, you'd get this from your backend/Firestore.
  const hasSubscription = false;

  const handleExportClick = () => {
    // If user is logged in and has a subscription, just print.
    // Otherwise, open the AuthGate.
    if (user && hasSubscription) {
      handlePrint();
    } else {
      setIsAuthGateOpen(true);
    }
  };
  
  const handlePrint = () => {
    const originalTitle = document.title;
    const fullName = resumeData.personalInfo.name || 'Resume';
    document.title = `${fullName} Resume`;
    window.print();
    document.title = originalTitle;
    setIsAuthGateOpen(false); // Close the dialog after printing
  };

  const handleSave = () => {
    // In a real app, this would save to Firestore
    if (!user) {
        toast({
            variant: "destructive",
            title: "Please log in",
            description: "You need to be logged in to save your resume.",
        });
        return;
    }
    toast({
      title: "Resume Saved!",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <>
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
            <Button onClick={handleExportClick} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Saving requires an account. Exporting to PDF requires a subscription.
          </p>
        </CardContent>
      </Card>
    </div>
    <AuthGate 
        isOpen={isAuthGateOpen}
        onClose={() => setIsAuthGateOpen(false)}
        onSubscribed={handlePrint}
    />
    </>
  );
}
