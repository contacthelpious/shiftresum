
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeData, ResumeDataSchema, defaultResumeData, DesignOptions, defaultDesignOptions } from '@/lib/definitions';
import { ResumeEditor } from '@/components/dashboard/resume-editor';
import { TemplateCustomizer } from '@/components/dashboard/template-customizer';
import { AiAssistant } from '@/components/dashboard/ai-assistant';
import { ResumePreview } from '@/components/dashboard/resume-preview';
import { Download, LayoutTemplate, Feather } from 'lucide-react';
import { DownloadTab } from '@/components/dashboard/download-tab';


export default function DashboardPage() {
  const [designOptions, setDesignOptions] = useState<DesignOptions>(defaultDesignOptions);
  const [activeTab, setActiveTab] = useState('content');
  
  const methods = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: defaultResumeData,
    mode: 'onBlur',
  });

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

          <div className="grid flex-1 md:grid-cols-2 no-print">
            <div className="flex flex-col md:col-span-1">
              <TabsContent value="content" className="mt-0 flex-1">
                <ScrollArea className="h-full">
                  <div className="p-4 lg:p-6">
                      <ResumeEditor />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="design" className="mt-0 flex-1">
                  <div className="relative h-full overflow-y-auto bg-muted/40">
                    <div className="flex justify-center items-start pt-8 pb-40 h-full">
                      <ResumePreview 
                          resumeData={resumeData} 
                          designOptions={designOptions} 
                          className="transform scale-[0.4] origin-top sm:scale-[0.5] md:scale-[0.8]"
                      />
                    </div>
                    <TemplateCustomizer 
                      designOptions={designOptions}
                      setDesignOptions={setDesignOptions}
                    />
                  </div>
              </TabsContent>
              
              <TabsContent value="download" className="mt-0 flex-1">
                 <ScrollArea className="h-full">
                   <div className="p-4 lg:p-6">
                      <DownloadTab />
                   </div>
                </ScrollArea>
              </TabsContent>
            </div>

            {/* Preview Panel for Content and AI tabs on desktop */}
            <div className={'hidden md:flex flex-col items-center justify-start bg-muted/40 p-8 overflow-auto'}>
              <ResumePreview 
                resumeData={resumeData}
                designOptions={designOptions}
                className="transform scale-[0.4] sm:scale-[0.6] md:scale-[0.4] lg:scale-[0.6] xl:scale-[0.7] origin-top"
              />
            </div>
          </div>
        </Tabs>
      </div>

      {/* Print Container */}
      <div className="print-container hidden print:block">
          <ResumePreview resumeData={resumeData} designOptions={designOptions} />
      </div>
    </FormProvider>
  );
}
