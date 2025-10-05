
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Download, Edit, Trash2 } from "lucide-react";
import type { WithId } from "@/firebase";
import type { ResumeData } from "@/lib/definitions";
import { formatDistanceToNow } from 'date-fns';
import { ResumePreview } from "../builder/resume-preview";
import { useUser, useFirestore } from "@/firebase";
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
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";


interface ResumeCardProps {
  resume: WithId<ResumeData>;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const lastEdited = resume.updatedAt?.toDate
    ? `${formatDistanceToNow(resume.updatedAt.toDate())} ago`
    : 'N/A';

  const handleDelete = () => {
    if (!user) return;
    const resumeRef = doc(firestore, `users/${user.uid}/resumes`, resume.id);
    deleteDocumentNonBlocking(resumeRef);
    toast({
      title: "Resume Deleted",
      description: `"${resume.title}" has been moved to the trash.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group flex flex-col">
      <CardContent className="p-0">
        <Link href={`/builder?resumeId=${resume.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted/30 flex items-center justify-center">
            <div className="transform scale-[0.2] origin-center pointer-events-none">
               <ResumePreview resumeData={resume.data} designOptions={resume.design} isInteractive={false} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-semibold truncate">{resume.title}</h3>
                <p className="text-xs text-white/80">Last edited: {lastEdited}</p>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50 mt-auto">
        <div className="flex justify-between items-center w-full">
            <div className="flex">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/builder?resumeId=${resume.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                     <Link href={`/builder?resumeId=${resume.id}&action=download`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                     </Link>
                </Button>
            </div>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
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
      </CardFooter>
    </Card>
  );
}
