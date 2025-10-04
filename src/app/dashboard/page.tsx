
'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Loader2 } from "lucide-react";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { ResumeData } from "@/lib/definitions";
import { defaultResumeFormData, defaultDesignOptions } from "@/lib/definitions";

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
        if (!user || !resumesRef) return;
        try {
            const newResumeData = {
                title: "Untitled Resume",
                data: defaultResumeFormData,
                design: defaultDesignOptions,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            const docRef = await addDoc(resumesRef, newResumeData);
            router.push(`/builder?resumeId=${docRef.id}`);
        } catch (error) {
            console.error("Error creating new resume:", error);
            // Optionally, show a toast notification
        }
    };


    if (isUserLoading || !user) {
        return (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        );
    }

    const userName = user.displayName || user.email?.split('@')[0] || 'there';

  return (
    <div className="container py-8 px-4 sm:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">Here's your dashboard. Ready to land that next job?</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Recent Resumes</CardTitle>
                <CardDescription>Your saved resumes. Click one to start editing.</CardDescription>
            </div>
            <Button onClick={handleNewResume}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Resume
            </Button>
        </CardHeader>
        <CardContent>
          {isResumesLoading && !resumes ? (
             <div className="text-center py-12">
               <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
               <p className="mt-2 text-sm text-muted-foreground">Loading your resumes...</p>
             </div>
          ) : resumes && resumes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">No resumes yet!</h3>
                <p className="text-sm text-muted-foreground mt-1">Click the button below to create your first one.</p>
                <Button onClick={handleNewResume} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Resume
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
