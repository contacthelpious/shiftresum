'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2 } from 'lucide-react';
import { parseResumeAction } from '@/lib/actions';
import { defaultResumeData, ResumeDataSchema } from '@/lib/definitions';
import { merge } from 'lodash';

export function UploadResumeButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const result = await parseResumeAction(formData);

      if (result.success && result.data) {
        sessionStorage.setItem('parsedResumeData', JSON.stringify(result.data));
        router.push('/dashboard');
        
        toast({
          title: 'Resume Parsed!',
          description: 'Your information has been pre-filled.',
        });
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Could not parse the resume.',
      });
    } finally {
      setIsParsing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx"
        disabled={isParsing}
      />
      <Button
        size="lg"
        variant="outline"
        onClick={handleButtonClick}
        disabled={isParsing}
      >
        {isParsing ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <UploadCloud className="mr-2 h-5 w-5" />
        )}
        <span>{isParsing ? 'Parsing...' : 'Upload Resume'}</span>
      </Button>
    </>
  );
}
