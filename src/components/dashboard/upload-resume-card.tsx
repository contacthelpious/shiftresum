
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upload Existing Resume</CardTitle>
          <CardDescription>Prefill the builder from a DOCX or PDF file.</CardDescription>
        </div>
        <Button onClick={handleUploadClick} disabled={isUploading} size="lg">
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          Upload
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
