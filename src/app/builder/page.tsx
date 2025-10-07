'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeFormData, ResumeFormSchema, defaultResumeFormData, DesignOptions, defaultDesignOptions, TemplateNameSchema, type TemplateName } from '@/lib/definitions';
import { ResumeEditor } from '@/components/builder/resume-editor';
import { TemplateCustomizer } from '@/components/builder/template-customizer';
import { ResumePreview } from '@/components/builder/resume-preview';
import { Download, LayoutTemplate, Feather, Loader2, Home } from 'lucide-react';
import { DownloadTab } from '@/components/builder/download-tab';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { ResumeData } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { type ExtractResumeDataOutput } from '@/ai/flows/extract-resume-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingSplash } from '@/components/ui/loading-splash';

// Helper function to get initial form data.
// This runs synchronously before the component renders.
const getInitialFormData = (): ResumeFormData => {
  if (typeof window === 'undefined') {
    return defaultResumeFormData;
  }
  // 1. Prioritize loading an in-progress draft. This handles refreshes.
  const draftDataString = sessionStorage.getItem('draft-resume-data');
  if (draftDataString) {
    try {
      return JSON.parse(draftDataString);
    } catch (e) {
      console.error('Failed to parse draft data:', e);
      sessionStorage.removeItem('draft-resume-data');
    }
  }

  // 2. If no draft, look for newly imported pre-fill data.
  const prefillDataString = sessionStorage.getItem('prefill-data');
  if (prefillDataString) {
    try {
      const prefillData: ExtractResumeDataOutput = JSON.parse(prefillDataString);
      // Mark as processed but do NOT remove the data itself,
      // so it can be reloaded on refresh if no edits have been made yet.
      sessionStorage.setItem('prefill-data-processed', 'true');

      const transformedData: ResumeFormData = {
        ...defaultResumeFormData,
        personalInfo: prefillData.personalInfo || defaultResumeFormData.personalInfo,
        experience: (prefillData.experience || []).map(exp => ({
          ...exp,
          id: crypto.randomUUID(),
          description: exp.description ? exp.description.map(d => ({ id: crypto.randomUUID(), value: d })) : []
        })),
        education: (prefillData.education || []).map(edu => ({ ...edu, id: crypto.randomUUID() })),
        skills: (prefillData.skills || []).map(skill => ({ ...skill, id: crypto.randomUUID() })),
        projects: (prefillData.projects || []).map(proj => ({ ...proj, id: crypto.randomUUID() })),
        certifications: (prefillData.certifications || []).map(cert => ({ ...cert, id: crypto.randomUUID() })),
        references: (prefillData.references || []).map(ref => ({ ...ref, id: crypto.randomUUID() })),
      };
      return transformedData;
    } catch (e) {
      console.error('Failed to parse prefill data:', e);
      sessionStorage.removeItem('prefill-data');
    }
  }

  // 3. Fallback to default placeholder data.
  return defaultResumeFormData;
};

const getInitialDesignOptions = (searchParams: URLSearchParams): DesignOptions => {
  const templateParam = searchParams.get('template');
  const parsed = TemplateNameSchema.safeParse(templateParam);
  if (parsed.success) {
    return { ...defaultDesignOptions, template: parsed.data };
  }
  return defaultDesignOptions;
}


export default function BuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const action = searchParams.get('action');
  const stripeStatus = searchParams.get('stripe');
  const { toast } = useToast();
  
  const { user, isUserLoading, isPro, isSubDataLoading } = useUser();
  const firestore = useFirestore();

  const [designOptions, setDesignOptions] = useState<DesignOptions>(() => getInitialDesignOptions(searchParams));
  const [activeTab, setActiveTab] = useState('content');
  
  const methods = useForm<ResumeFormData>({
    resolver: zodResolver(ResumeFormSchema),
    // Initialize the form synchronously with the best available data
    defaultValues: getInitialFormData(),
    mode: 'onBlur',
  });
  
  const resumeRef = useMemoFirebase(() => {
    // Do not fetch from firestore if it's a new resume being edited
    if (!user || !resumeId || resumeId === '__new__' || isUserLoading) return null;
    return doc(firestore, `users/${user.uid}/resumes`, resumeId);
  }, [firestore, user, resumeId, isUserLoading]);

  const { data: resumeData, isLoading: isResumeLoading } = useDoc<ResumeData>(resumeRef);

  useEffect(() => {
    // This effect handles loading data from Firestore for existing, saved resumes.
    if (resumeData) {
      methods.reset(resumeData.data);
      setDesignOptions(resumeData.design);
    }
    // This handles cleaning up the initial import flag. It no longer removes the data itself.
    if (sessionStorage.getItem('prefill-data-processed')) {
        sessionStorage.removeItem('prefill-data-processed');
    }
  }, [resumeData, methods]);
  
  const watchedData = methods.watch();
  // Auto-save to session storage for new resumes
  useEffect(() => {
    if (resumeId === '__new__') {
        sessionStorage.setItem('draft-resume-data', JSON.stringify(watchedData));
    }
  }, [watchedData, resumeId]);


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
    if (action === 'download' && !isSubDataLoading) {
      setActiveTab('download');
       const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('action');
      router.replace(`${window.location.pathname}?${newParams.toString()}`);
    }
  }, [action, isSubDataLoading, router, searchParams]);

  const isLoading = isUserLoading || (!!resumeId && resumeId !== '__new__' && isResumeLoading);

  if (isLoading) {
    return <LoadingSplash messages={['Loading your workspace...', 'Polishing the pixels...']} />;
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-screen">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b no-print w-full flex items-center justify-between">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard" aria-label="Go to Dashboard">
                    <Home className="h-5 w-5 text-muted-foreground" />
                </Link>
            </Button>
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
            <div className="w-10"></div> {/* Spacer to balance the home icon */}
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
