
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tailorResumeAction } from '@/lib/actions';
import type { WithId } from '@/firebase';
import type { ResumeData } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface TailorResumeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resume: WithId<ResumeData>;
}

export function TailorResumeDialog({ isOpen, onClose, resume }: TailorResumeDialogProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      toast({
        variant: 'destructive',
        title: 'Job description is empty.',
        description: 'Please paste a job description to tailor your resume.',
      });
      return;
    }

    setIsTailoring(true);

    // Clear any old session data before starting
    sessionStorage.removeItem('draft-resume-data');
    sessionStorage.removeItem('prefill-data');
    sessionStorage.removeItem('prefill-data-processed');

    const result = await tailorResumeAction(resume.data, jobDescription);

    setIsTailoring(false);

    if (result.success) {
      toast({
        title: 'Resume Tailored!',
        description: 'Redirecting to the builder with your optimized resume...',
      });
      sessionStorage.setItem('prefill-data', JSON.stringify(result.data));
      router.push('/builder?resumeId=__new__&source=tailor');
      onClose();
    } else {
      toast({
        variant: 'destructive',
        title: 'Tailoring Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-accent" />
            Tailor Resume for a Job
          </DialogTitle>
          <DialogDescription>
            Paste the job description below. Our AI will optimize your resume to match the role's requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <Alert>
                <AlertTitle>How it Works</AlertTitle>
                <AlertDescription>
                    A new, tailored version of your resume will be created. Your original resume will not be changed.
                </AlertDescription>
            </Alert>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the full job description here..."
              rows={12}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isTailoring}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isTailoring}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleTailor} disabled={isTailoring}>
            {isTailoring ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Tailor Resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
