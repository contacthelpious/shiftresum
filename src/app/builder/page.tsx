
'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeData, ResumeDataSchema, defaultResumeData, DesignOptions, defaultDesignOptions } from '@/lib/definitions';
import { ResumeEditor } from '@/components/builder/resume-editor';
import { TemplateCustomizer } from '@/components/builder/template-customizer';
import { ResumePreview } from '@/components/builder/resume-preview';
import { Download, LayoutTemplate, Feather } from 'lucide-react';
import { DownloadTab } from '@/components/builder/download-tab';
import { cn } from '@/lib/utils';


export default function BuilderPage() {
  const [designOptions, setDesignOptions] = useState<DesignOptions>(defaultDesignOptions);
  const [activeTab, setActiveTab] = useState('content');
  
  const methods = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: defaultResumeData,
    mode: 'onBlur',
  });

  useEffect(() => {
    try {
      const parsedDataString = sessionStorage.getItem('parsedResumeData');
      if (parsedDataString) {
        const parsedData = JSON.parse(parsedDataString);
        // Validate and merge with defaults before resetting the form
        const result = ResumeDataSchema.safeParse(parsedData);
        if (result.success) {
          methods.reset(result.data);
        } else {
          console.error("Failed to parse resume data from sessionStorage:", result.error);
        }
        // Clean up sessionStorage
        sessionStorage.removeItem('parsedResumeData');
      }
    } catch (error) {
      console.error("Error processing sessionStorage data:", error);
    }
  }, [methods]);

  const resumeData = methods.watch();

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
                              resumeData={resumeData} 
                              designOptions={designOptions} 
                          />
                        </div>
                    </div>
                    <TemplateCustomizer 
                      resumeData={resumeData}
                      designOptions={designOptions}
                      setDesignOptions={setDesignOptions}
                    />
                  </div>
              </TabsContent>
              
              <TabsContent value="download" className="mt-0 flex-1">
                 <ScrollArea className="h-full">
                   <div className="p-4 lg:p-6">
                      <DownloadTab resumeData={resumeData} />
                   </div>
                </ScrollArea>
              </TabsContent>
            </div>

            {/* Preview Panel for Content and Download tabs on desktop */}
            <div className={cn(
              'hidden bg-muted/40 p-8 overflow-auto',
              activeTab !== 'design' && 'md:flex flex-col items-center justify-start'
            )}>
              <div className="transform scale-[0.5] sm:scale-[0.6] md:scale-[0.4] lg:scale-[0.6] xl:scale-[0.7] origin-top">
                <ResumePreview 
                  resumeData={resumeData}
                  designOptions={designOptions}
                />
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Print Container */}
      <div className="print-container hidden">
          <ResumePreview resumeData={resumeData} designOptions={designOptions} />
      </div>
    </FormProvider>
  );
}
