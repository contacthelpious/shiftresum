
'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadResumeAndExtractDataAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export function UploadResumeCard() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleUploadClick = () => {
    // Clear any previous session data before starting a new upload
    sessionStorage.removeItem('draft-resume-data');
    sessionStorage.removeItem('prefill-data');
    sessionStorage.removeItem('prefill-data-processed');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset file input to allow re-uploading the same file
    event.target.value = '';

    setIsUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    const result = await uploadResumeAndExtractDataAction(formData);

    setIsUploading(false);

    if (result.success) {
      toast({
        title: 'Resume Processed!',
        description: 'Your data has been extracted. Redirecting to the builder...',
      });
      // Store the parsed data in sessionStorage to pass it to the builder
      sessionStorage.setItem('prefill-data', JSON.stringify(result.data));
      router.push('/builder?resumeId=__new__&source=import');
    } else {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Existing Resume</CardTitle>
        <CardDescription>Prefill the builder from a DOCX or PDF file.</CardDescription>
        <Button onClick={handleUploadClick} disabled={isUploading} className="mt-2 w-full sm:w-auto">
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          Upload Resume
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".docx,.pdf"
        />
      </CardHeader>
    </Card>
  );
}
