
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
import { Wand2, LayoutTemplate, Feather } from 'lucide-react';


export default function DashboardPage() {
  const [designOptions, setDesignOptions] = useState<DesignOptions>(defaultDesignOptions);
  
  const methods = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: defaultResumeData,
    mode: 'onBlur',
  });

  const resumeData = methods.watch();

  return (
    <FormProvider {...methods}>
      <div className="grid h-[calc(100vh-4rem)] md:grid-cols-[1fr_1fr] no-print">
        <Tabs defaultValue="content" className="flex flex-col md:col-span-1">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">
                <Feather className="mr-2 h-4 w-4" /> Content
              </TabsTrigger>
              <TabsTrigger value="design">
                <LayoutTemplate className="mr-2 h-4 w-4" /> Design
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Wand2 className="mr-2 h-4 w-4" /> AI Assistant
              </TabsTrigger>
            </TabsList>
          </div>
          <ScrollArea className="flex-1">
            <TabsContent value="content" className="mt-0 p-4 lg:p-6">
              <ResumeEditor />
            </TabsContent>
            <TabsContent value="design" className="mt-0 p-0 md:hidden">
                <div className="relative h-[calc(100vh-8rem)] overflow-y-auto bg-muted/40">
                  <div className="flex justify-center items-start pt-8 pb-40">
                    <ResumePreview 
                        resumeData={resumeData} 
                        designOptions={designOptions} 
                        className="transform scale-[0.6] origin-top"
                    />
                  </div>
                  <TemplateCustomizer 
                    designOptions={designOptions}
                    setDesignOptions={setDesignOptions}
                  />
                </div>
            </TabsContent>
            <TabsContent value="ai" className="mt-0 p-4 lg:p-6">
              <AiAssistant />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Preview Panel for Content and AI tabs on desktop */}
        <div className="hidden md:flex flex-col items-center justify-start bg-muted/40 p-8 overflow-auto">
          <ResumePreview 
            resumeData={resumeData}
            designOptions={designOptions}
            className="transform scale-[0.4] sm:scale-[0.6] md:scale-[0.4] lg:scale-[0.6] xl:scale-[0.7] origin-top"
          />
        </div>
      </div>

      {/* Print Container */}
      <div className="print-container hidden print:block">
          <ResumePreview resumeData={resumeData} designOptions={designOptions} />
      </div>
    </FormProvider>
  );
}
