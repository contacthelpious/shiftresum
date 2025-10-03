
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Save } from 'lucide-react';
import type { ResumeFormData, DesignOptions } from '@/lib/definitions';
import { AuthGate } from './auth-gate';
import { useUser, useFirestore } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useFormContext } from 'react-hook-form';

interface DownloadTabProps {
  resumeId: string | null;
  designOptions: DesignOptions;
}

export function DownloadTab({ resumeId, designOptions }: DownloadTabProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { getValues } = useFormContext<ResumeFormData>();
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);

  // This is a placeholder. In a real app, you'd get this from your backend/Firestore.
  const hasSubscription = false;

  const handleExportClick = () => {
    if (user && hasSubscription) {
      handlePrint();
    } else {
      setIsAuthGateOpen(true);
    }
  };
  
  const handlePrint = () => {
    const originalTitle = document.title;
    const formData = getValues();
    const fullName = formData.personalInfo.name || 'Resume';
    document.title = `${fullName} Resume`;
    window.print();
    document.title = originalTitle;
    setIsAuthGateOpen(false);
  };

  const handleSave = () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Please log in",
            description: "You need to be logged in to save your resume.",
        });
        setIsAuthGateOpen(true);
        return;
    }
    if (!resumeId) {
        toast({
            variant: "destructive",
            title: "Cannot Save",
            description: "No active resume to save. Try creating a new one from the dashboard.",
        });
        return;
    }
    
    const formData = getValues();
    const resumeDocRef = doc(firestore, `users/${user.uid}/resumes`, resumeId);

    const dataToSave = {
        title: `${formData.personalInfo.name || 'Untitled'}'s Resume`,
        data: formData,
        design: designOptions,
        updatedAt: serverTimestamp(),
    };

    setDocumentNonBlocking(resumeDocRef, dataToSave, { merge: true });

    toast({
      title: "Resume Saved!",
      description: "Your changes have been saved to the cloud.",
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
