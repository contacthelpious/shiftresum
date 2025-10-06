'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Edit, Trash2, Copy, Share2, Sparkles, ArrowRight } from 'lucide-react';
import type { WithId } from '@/firebase';
import type { ResumeData } from '@/lib/definitions';
import { format } from 'date-fns';
import { ResumePreview } from '../builder/resume-preview';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ResumeCardProps {
  resume: WithId<ResumeData>;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const lastEdited = resume.updatedAt?.toDate
    ? `Updated ${format(resume.updatedAt.toDate(), 'dd MMM yyyy')}`
    : `Created ${format(resume.createdAt.toDate(), 'dd MMM yyyy')}`;

  const handleDelete = () => {
    if (!user) return;
    const resumeRef = doc(firestore, `users/${user.uid}/resumes`, resume.id);
    deleteDocumentNonBlocking(resumeRef);
    toast({
      title: 'Resume Deleted',
      description: `"${resume.title}" has been moved to the trash.`,
    });
  };

  const handleCopy = () => {
    toast({
      title: 'Coming Soon!',
      description: 'The ability to duplicate a resume is on its way.',
    });
  }

  const handleShare = () => {
     toast({
      title: 'Coming Soon!',
      description: 'Sharing options will be available in a future update.',
    });
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Thumbnail */}
          <Link href={`/builder?resumeId=${resume.id}`} className="block shrink-0 mx-auto sm:mx-0">
            <div className="relative w-[150px] h-[212px] overflow-hidden bg-muted/30 flex items-center justify-center rounded-lg border">
              <div className="transform scale-[0.18] origin-center pointer-events-none">
                <ResumePreview resumeData={resume.data} designOptions={resume.design} isInteractive={false} />
              </div>
            </div>
          </Link>

          {/* Details & Actions */}
          <div className="flex flex-col flex-1">
            <div className="flex-1">
              <h3 className="text-xl font-bold font-headline">{resume.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{lastEdited}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/builder?resumeId=${resume.id}&action=download`}>
                    <Download />
                    <span className="ml-2">Download</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/builder?resumeId=${resume.id}`}>
                    <Edit />
                     <span className="ml-2">Edit</span>
                  </Link>
                </Button>
                 <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy />
                     <span className="ml-2">Copy</span>
                 </Button>
                 <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 />
                     <span className="ml-2">Share</span>
                 </Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 />
                             <span className="ml-2">Delete</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete "{resume.title}". This cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Tailor CTA */}
            <div className="mt-auto bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
               <div className="flex items-center justify-center gap-2 mb-3">
                   <Sparkles className="h-5 w-5 text-accent"/>
                   <p className="text-sm font-medium text-foreground">
                       Customizing your resume for each job can triple your chances of getting an interview.
                   </p>
               </div>
               <Button className="w-full" onClick={() => toast({ title: 'Coming Soon!' })}>
                   Tailor this resume
                   <ArrowRight className="ml-2" />
               </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
