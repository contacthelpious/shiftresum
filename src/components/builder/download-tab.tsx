
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Save, Loader2 } from 'lucide-react';
import type { ResumeFormData, DesignOptions } from '@/lib/definitions';
import { AuthGate } from './auth-gate';
import { useUser, useFirestore } from '@/firebase';
import { doc, collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useFormContext } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';

interface DownloadTabProps {
  resumeId: string | null;
  designOptions: DesignOptions;
}

export function DownloadTab({ resumeId: initialResumeId, designOptions }: DownloadTabProps) {
  const { toast } = useToast();
  const { user, isPro } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getValues } = useFormContext<ResumeFormData>();
  
  const [resumeId, setResumeId] = useState(initialResumeId);
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleExportClick = () => {
    // Temporarily bypass the isPro check
    handlePrint();
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

  const handleSave = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Please log in",
            description: "You need to be logged in to save your resume.",
        });
        setIsAuthGateOpen(true);
        return;
    }

    setIsSaving(true);
    const formData = getValues();
    const dataToSave = {
        title: `${formData.personalInfo.name || 'Untitled'}'s Resume`,
        data: formData,
        design: designOptions,
        updatedAt: serverTimestamp(),
    };

    try {
        if (resumeId && resumeId !== '__new__') {
            // Update existing document
            const resumeDocRef = doc(firestore, `users/${user.uid}/resumes`, resumeId);
            setDocumentNonBlocking(resumeDocRef, dataToSave, { merge: true });
            toast({
              title: "Resume Saved!",
              description: "Your changes have been saved to the cloud.",
            });
        } else {
            // Create a new document
            const resumesColRef = collection(firestore, `users/${user.uid}/resumes`);
            const newDocRef = await addDoc(resumesColRef, { ...dataToSave, createdAt: serverTimestamp() });
            
            setResumeId(newDocRef.id);
            // Update URL without reloading page to reflect the new resume ID
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('resumeId', newDocRef.id);
            router.replace(`${window.location.pathname}?${newParams.toString()}`);

            toast({
              title: "Resume Created & Saved!",
              description: "Your new resume has been saved to your dashboard.",
            });
        }
    } catch (error) {
        console.error("Error saving resume:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save your resume. Please try again.",
        });
    } finally {
        setIsSaving(false);
    }
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
              <Button onClick={handleSave} variant="outline" className="w-full sm:w-auto" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Progress
              </Button>
              <Button onClick={handleExportClick} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export to PDF
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Saving requires an account. Exporting to PDF is currently open to all users.
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
