'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeFormData, ResumeFormSchema, defaultResumeFormData, DesignOptions, defaultDesignOptions } from '@/lib/definitions';
import { ResumeEditor } from '@/components/builder/resume-editor';
import { TemplateCustomizer } from '@/components/builder/template-customizer';
import { ResumePreview } from '@/components/builder/resume-preview';
import { Download, LayoutTemplate, Feather, Loader2 } from 'lucide-react';
import { DownloadTab } from '@/components/builder/download-tab';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { ResumeData } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';

export default function BuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const action = searchParams.get('action');
  const stripeStatus = searchParams.get('stripe');
  const { toast } = useToast();
  
  const { user, isUserLoading, isPro, isSubDataLoading } = useUser();
  const firestore = useFirestore();

  const [designOptions, setDesignOptions] = useState<DesignOptions>(defaultDesignOptions);
  const [activeTab, setActiveTab] = useState('content');
  
  const methods = useForm<ResumeFormData>({
    resolver: zodResolver(ResumeFormSchema),
    defaultValues: defaultResumeFormData,
    mode: 'onBlur',
  });
  
  const resumeRef = useMemoFirebase(() => {
    if (!user || !resumeId || resumeId === '__new__' || isUserLoading) return null;
    return doc(firestore, `users/${user.uid}/resumes`, resumeId);
  }, [firestore, user, resumeId, isUserLoading]);

  const { data: resumeData, isLoading: isResumeLoading } = useDoc<ResumeData>(resumeRef);

  useEffect(() => {
    if (stripeStatus) {
      if (stripeStatus === 'success') {
        toast({
          title: 'Payment Successful!',
          description: "Welcome to Pro! You can now download your resume.",
        });
      } else if (stripeStatus === 'cancel') {
        toast({
          variant: 'destructive',
          title: 'Payment Canceled',
          description: 'Your payment was not completed.',
        });
      }
      // Remove stripe params from URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('stripe');
      newParams.delete('session_id'); // Also remove session_id if present
      router.replace(`${window.location.pathname}?${newParams.toString()}`);
    }
  }, [stripeStatus, router, toast, searchParams]);

 useEffect(() => {
    // If we have an existing resume from Firestore, load it.
    if (resumeData) {
      methods.reset(resumeData.data);
      setDesignOptions(resumeData.design);
      return;
    }

    // If this is a new resume and we aren't loading existing data, use the default.
    if (resumeId === '__new__' && !isResumeLoading) {
      methods.reset(defaultResumeFormData);
    }
  }, [resumeData, isResumeLoading, resumeId, methods]);


  useEffect(() => {
    if (action === 'download' && !isSubDataLoading) {
      setActiveTab('download');
       const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('action');
      router.replace(`${window.location.pathname}?${newParams.toString()}`);
    }
  }, [action, isSubDataLoading, router, searchParams]);

  const watchedData = methods.watch();
  const isLoading = isUserLoading || (!!resumeId && resumeId !== '__new__' && isResumeLoading);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b no-print w-full flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="content">
                <Feather className="mr-2 h-4 w-4" /> Content
              </TabsTrigger>
              <TabsTrigger value="design">
                <LayoutTemplate className="mr-2 h-4 w-4" /> Design
              </TabsTrigger>
              <TabsTrigger value="download">
                <Download className="mr-2 h-4 w-4" /> Download
              </TabsTrigger>
            </TabsList>
          </div>

          <div className={cn(
            "grid flex-1 no-print",
            activeTab === 'design' ? 'grid-cols-1' : 'md:grid-cols-2'
          )}>
            <div className="flex flex-col">
              <TabsContent value="content" className="mt-0 flex-1">
                <ScrollArea className="h-full">
                  <div className="p-4 lg:p-6">
                      <ResumeEditor />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="design" className="mt-0 flex-1">
                  <div className="relative h-full overflow-y-auto bg-muted/40 p-4">
                    <div className="flex justify-center items-start py-8">
                       <div className="transform scale-[0.5] sm:scale-[0.6] lg:scale-[0.7] origin-top">
                          <ResumePreview 
                              resumeData={watchedData} 
                              designOptions={designOptions} 
                          />
                        </div>
                    </div>
                    <TemplateCustomizer 
                      resumeData={watchedData}
                      designOptions={designOptions}
                      setDesignOptions={setDesignOptions}
                    />
                  </div>
              </TabsContent>
              
              <TabsContent value="download" className="mt-0 flex-1">
                 <ScrollArea className="h-full">
                   <div className="p-4 lg:p-6">
                      <DownloadTab resumeId={resumeId} designOptions={designOptions} />
                   </div>
                </ScrollArea>
              </TabsContent>
            </div>

            <div className={cn(
              'hidden bg-muted/40 p-8 overflow-auto',
              activeTab !== 'design' && 'md:flex flex-col items-center justify-start'
            )}>
              <div className="transform scale-[0.5] sm:scale-[0.6] md:scale-[0.4] lg:scale-[0.6] xl:scale-[0.7] origin-top">
                <ResumePreview 
                  resumeData={watchedData}
                  designOptions={designOptions}
                />
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      <div className="print-container hidden">
          <ResumePreview resumeData={watchedData} designOptions={designOptions} />
      </div>
    </FormProvider>
  );
}
