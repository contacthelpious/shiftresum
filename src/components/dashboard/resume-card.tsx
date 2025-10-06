
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
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { TailorResumeDialog } from './tailor-resume-dialog';

interface ResumeCardProps {
  resume: WithId<ResumeData>;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isTailorDialogOpen, setIsTailorDialogOpen] = useState(false);

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
  
  const ActionButton = ({ href, onClick, children, className, 'aria-label': ariaLabel }: { href?: string, onClick?: () => void, children: React.ReactNode, className?: string, 'aria-label'?: string }) => {
    const content = (
      <Button variant="ghost" size="icon" className={cn("rounded-full h-10 w-10 md:h-9 md:w-auto md:px-4 md:rounded-md", className)} aria-label={ariaLabel}>
        {children}
      </Button>
    );

    if (href) {
      return <Link href={href}>{content}</Link>
    }
    return <div onClick={onClick}>{content}</div>;
  };


  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg w-full">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            
            {/* Thumbnail */}
            <Link href={`/builder?resumeId=${resume.id}`} className="block shrink-0 group">
              <div className="relative w-[150px] h-[212px] overflow-hidden bg-muted/30 flex items-center justify-center rounded-lg border group-hover:ring-2 group-hover:ring-primary transition-all">
                <div className="transform scale-[0.18] origin-center pointer-events-none">
                  <ResumePreview resumeData={resume.data} designOptions={resume.design} isInteractive={false} />
                </div>
              </div>
            </Link>

            {/* Details & Actions */}
            <div className="flex flex-col flex-1 w-full items-center md:items-start">
              <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold font-headline">{resume.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{lastEdited}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-1 justify-center mb-6">
                  <ActionButton href={`/builder?resumeId=${resume.id}`} aria-label="Edit Resume">
                      <Edit className="h-5 w-5 md:mr-2" />
                      <span className="hidden md:inline">Edit</span>
                  </ActionButton>
                  <ActionButton href={`/builder?resumeId=${resume.id}&action=download`} aria-label="Download Resume">
                      <Download className="h-5 w-5 md:mr-2" />
                      <span className="hidden md:inline">Download</span>
                  </ActionButton>
                  <ActionButton onClick={handleCopy} aria-label="Copy Resume">
                      <Copy className="h-5 w-5 md:mr-2" />
                      <span className="hidden md:inline">Copy</span>
                  </ActionButton>
                  <ActionButton onClick={handleShare} aria-label="Share Resume">
                      <Share2 className="h-5 w-5 md:mr-2" />
                      <span className="hidden md:inline">Share</span>
                  </ActionButton>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive rounded-full h-10 w-10 md:h-9 md:w-auto md:px-4 md:rounded-md" aria-label="Delete Resume">
                              <Trash2 className="h-5 w-5 md:mr-2" />
                              <span className="hidden md:inline">Delete</span>
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
              
              {/* Tailor CTA */}
              <div className="mt-auto bg-primary/5 border border-primary/20 rounded-lg p-4 text-center w-full">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-accent"/>
                    <p className="text-sm font-medium text-foreground text-center md:text-left">
                        Tailor this resume for a specific job to triple your chances.
                    </p>
                </div>
                <Button className="w-full" onClick={() => setIsTailorDialogOpen(true)}>
                    Tailor this resume
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <TailorResumeDialog 
        isOpen={isTailorDialogOpen}
        onClose={() => setIsTailorDialogOpen(false)}
        resume={resume}
      />
    </>
  );
}
