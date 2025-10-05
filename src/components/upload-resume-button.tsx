'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2 } from 'lucide-react';
import { parseResumeAction } from '@/lib/actions';
import { defaultResumeData, ResumeDataSchema } from '@/lib/definitions';
import { merge } from 'lodash';
import { cn } from '@/lib/utils';

export function UploadResumeButton(props: Omit<ButtonProps, 'onClick' | 'disabled' | 'children' | 'size'> & { size?: ButtonProps['size']}) {
  const { className, size, ...rest } = props;
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
        router.push('/builder?resumeId=__new__');
        
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

  const isLarge = size === 'lg';

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
        size={size}
        variant="outline"
        onClick={handleButtonClick}
        disabled={isParsing}
        className={cn("w-full sm:w-auto", className)}
        {...rest}
      >
        {isParsing ? (
          <Loader2 className={cn("mr-2", isLarge ? "h-5 w-5" : "h-4 w-4", "animate-spin")} />
        ) : (
          <UploadCloud className={cn("mr-2", isLarge ? "h-5 w-5" : "h-4 w-4")} />
        )}
        <span>{isParsing ? 'Parsing...' : 'Upload Resume'}</span>
      </Button>
    </>
  );
}
