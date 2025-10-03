
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
import { Wand2, LayoutTemplate, Feather, Eye } from 'lucide-react';


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
      <div className="grid h-[calc(100vh-4rem)] md:grid-cols-2 no-print">
        {/* Editor & Mobile Preview Panel */}
        <div className="flex flex-col">
          <Tabs defaultValue="content" className="flex-1 flex flex-col">
            <div className="px-4 py-2 border-b">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-3">
                <TabsTrigger value="content">
                  <Feather className="mr-2 h-4 w-4" /> Content
                </TabsTrigger>
                <TabsTrigger value="design">
                  <LayoutTemplate className="mr-2 h-4 w-4" /> Design
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Wand2 className="mr-2 h-4 w-4" /> AI Assistant
                </TabsTrigger>
                <TabsTrigger value="preview" className="md:hidden">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </TabsTrigger>
              </TabsList>
            </div>
            <ScrollArea className="flex-1">
              <TabsContent value="content" className="mt-0 p-4 lg:p-6">
                <ResumeEditor />
              </TabsContent>
              <TabsContent value="design" className="mt-0 p-4 lg:p-6">
                <TemplateCustomizer 
                  designOptions={designOptions}
                  setDesignOptions={setDesignOptions}
                />
              </TabsContent>
              <TabsContent value="ai" className="mt-0 p-4 lg:p-6">
                <AiAssistant />
              </TabsContent>
              {/* Mobile-only Preview Content */}
              <TabsContent value="preview" className="mt-0 md:hidden bg-muted/40 p-4 flex flex-col items-center">
                 <ResumePreview 
                    resumeData={resumeData} 
                    designOptions={designOptions} 
                    className="transform scale-50 sm:scale-[0.65] origin-top"
                 />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Preview Panel */}
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
