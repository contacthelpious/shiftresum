'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2 } from 'lucide-react';
import { parseResumeAction } from '@/lib/actions';
import { cn } from '@/lib/utils';

export function UploadResumeButton(props: Omit<ButtonProps, 'onClick' | 'disabled' | 'children'>) {
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
        // Store the successfully parsed and validated data in session storage
        sessionStorage.setItem('parsedResumeData', JSON.stringify(result.data));
        
        // Redirect to the builder page
        router.push('/builder?resumeId=__new__');
        
        toast({
          title: 'Resume Parsed!',
          description: 'Your information has been pre-filled into the builder.',
        });
      } else {
        // Throw an error if the action was not successful or returned no data
        throw new Error(result.error || 'An unknown error occurred during parsing.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Could not parse the resume. Please try again.',
      });
    } finally {
      setIsParsing(false);
      // Reset file input to allow re-uploading the same file
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
        variant="outline"
        onClick={handleButtonClick}
        disabled={isParsing}
        {...props}
      >
        {isParsing ? (
          <Loader2 className={cn("mr-2 h-4 w-4 animate-spin")} />
        ) : (
          <UploadCloud className={cn("mr-2 h-4 w-4")} />
        )}
        <span>{isParsing ? 'Parsing...' : 'Upload Resume'}</span>
      </Button>
    </>
  );
}
