'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Loader2 } from "lucide-react";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection } from "firebase/firestore";
import type { ResumeData } from "@/lib/definitions";
import { UploadResumeCard } from '@/components/dashboard/upload-resume-card';
import { LoadingSplash } from '@/components/ui/loading-splash';

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const resumesRef = useMemoFirebase(() => {
        if (isUserLoading || !user) return null;
        return collection(firestore, 'users', user.uid, 'resumes');
    }, [firestore, user, isUserLoading]);

    const { data: resumes, isLoading: isResumesLoading } = useCollection<ResumeData>(resumesRef);

    useEffect(() => {
        // Redirect to login if auth check is complete and there's no user.
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const handleNewResume = async () => {
        // Clear any old drafts or pre-fill data to ensure a clean start
        sessionStorage.removeItem('draft-resume-data');
        sessionStorage.removeItem('prefill-data');
        sessionStorage.removeItem('prefill-data-processed');
        router.push(`/builder?resumeId=__new__`);
    };


    if (isUserLoading || !user) {
        return <LoadingSplash messages={['Loading your dashboard...', 'Getting your documents ready...']} />;
    }

    const userName = user.displayName || user.email?.split('@')[0] || 'there';

  return (
    <div className="container py-8 px-4 sm:px-8 w-full max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">Here's your dashboard. Ready to land that next job?</p>
      </div>

       <div className="grid gap-4 mb-8 md:grid-cols-2">
            <Card>
                 <CardHeader>
                    <CardTitle>Create New Resume</CardTitle>
                    <CardDescription>Start from scratch with a template.</CardDescription>
                    <Button onClick={handleNewResume} className="mt-2 w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Resume
                    </Button>
                </CardHeader>
            </Card>
            <UploadResumeCard />
       </div>

      <div>
        <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Resumes</h2>
            <p className="text-muted-foreground">Your saved resumes. Click one to start editing.</p>
        </div>
        
        {isResumesLoading && !resumes ? (
            <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading your resumes...</p>
            </div>
        ) : resumes && resumes.length > 0 ? (
            <div className="flex flex-col gap-6">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">No resumes yet!</h3>
                <p className="text-sm text-muted-foreground mt-1">Create or upload a resume to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
}
