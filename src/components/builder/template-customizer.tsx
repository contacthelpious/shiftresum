
'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DesignOptions, ResumeFormData, TemplateName } from '@/lib/definitions';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Palette, Pen, Type, X, AlignLeft, AlignCenter, AlignRight, Pilcrow } from 'lucide-react';
import { ResumePreview } from './resume-preview';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Separator } from '../ui/separator';

interface TemplateCustomizerProps {
  resumeData: ResumeFormData;
  designOptions: DesignOptions;
  setDesignOptions: Dispatch<SetStateAction<DesignOptions>>;
}

const colors = [
  { name: 'Slate', value: '#2c3e50' },
  { name: 'Graphite', value: '#34495e' },
  { name: 'Forest', value: '#27ae60' },
  { name: 'Amethyst', value: '#8e44ad' },
  { name: 'Crimson', value: '#c0392b' },
  { name: 'Teal', value: '#16a085' },
];

const fonts = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Garamond', value: 'Garamond' },
  { name: 'Verdana', value: 'Verdana' },
];

const templates: { name: string, value: TemplateName }[] = [
    { name: 'Modern', value: 'modern' },
    { name: 'Classic', value: 'classic' },
    { name: 'Executive', value: 'executive' },
    { name: 'Minimal', value: 'minimal' },
    { name: 'Bold', value: 'bold' },
    { name: 'Metro', value: 'metro' },
    { name: 'Elegant', value: 'elegant' },
    { name: 'Compact', value: 'compact' },
    { name: 'Creative', value: 'creative' },
    { name: 'Timeline', value: 'timeline' },
    { name: 'Professional', value: 'professional' },
    { name: 'Startup', value: 'startup' },
    { name: 'Nordic', value: 'nordic' },
    { name: 'Focus', value: 'focus' },
    { name: 'Signature', value: 'signature' },
];

type OpenSheet = 'template' | 'color' | 'font' | 'layout' | null;

export function TemplateCustomizer({ resumeData, designOptions, setDesignOptions }: TemplateCustomizerProps) {
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);

  const renderSheetContent = () => {
    let content;
    switch (openSheet) {
      case 'color':
        content = (
          <div className="flex flex-wrap gap-3 justify-center">
            {colors.map(color => (
              <button
                key={color.value}
                title={color.name}
                className={`h-8 w-8 rounded-full border-2 transition-all ${designOptions.color === color.value ? 'border-primary ring-2 ring-ring ring-offset-2' : 'border-transparent'}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setDesignOptions(prev => ({...prev, color: color.value}))}
              />
            ))}
          </div>
        );
        break;
      case 'font':
        content = (
          <div className="space-y-4">
              <div className='space-y-2'>
                  <Label>Font Family</Label>
                  <Select
                      value={designOptions.font}
                      onValueChange={(value) => setDesignOptions(prev => ({...prev, font: value as DesignOptions['font']}))}
                  >
                      <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
                      <SelectContent>
                      {fonts.map(font => (
                          <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>
                      ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className='space-y-2'>
                  <Label>Font Size</Label>
                  <ToggleGroup 
                      type="single" 
                      value={designOptions.fontSize} 
                      onValueChange={(value) => {
                          if (value) setDesignOptions(prev => ({...prev, fontSize: value as 'small' | 'medium' | 'large'}))
                      }}
                      className="w-full grid grid-cols-3"
                  >
                      <ToggleGroupItem value="small" aria-label="Small font">Small</ToggleGroupItem>
                      <ToggleGroupItem value="medium" aria-label="Medium font">Medium</ToggleGroupItem>
                      <ToggleGroupItem value="large" aria-label="Large font">Large</ToggleGroupItem>
                  </ToggleGroup>
              </div>
          </div>
        );
        break;
      case 'layout':
        content = (
           <div className="space-y-4">
              <div className='space-y-2'>
                  <Label>Text Alignment</Label>
                  <ToggleGroup 
                      type="single" 
                      value={designOptions.alignment} 
                      onValueChange={(value) => {
                          if (value) setDesignOptions(prev => ({...prev, alignment: value as 'left' | 'center' | 'right'}))
                      }}
                      className="w-full grid grid-cols-3"
                  >
                      <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft /></ToggleGroupItem>
                      <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter /></ToggleGroupItem>
                      <ToggleGroupItem value="right" aria-label="Align right"><AlignRight /></ToggleGroupItem>
                  </ToggleGroup>
              </div>
              <div className='space-y-2'>
                  <Label>Line Spacing</Label>
                   <ToggleGroup 
                      type="single" 
                      value={designOptions.lineHeight} 
                      onValueChange={(value) => {
                          if (value) setDesignOptions(prev => ({...prev, lineHeight: value as 'compact' | 'standard' | 'relaxed'}))
                      }}
                      className="w-full grid grid-cols-3"
                  >
                      <ToggleGroupItem value="compact" aria-label="Compact spacing">Compact</ToggleGroupItem>
                      <ToggleGroupItem value="standard" aria-label="Standard spacing">Standard</ToggleGroupItem>
                      <ToggleGroupItem value="relaxed" aria-label="Relaxed spacing">Relaxed</ToggleGroupItem>
                  </ToggleGroup>
              </div>
           </div>
        );
        break;
      default:
        return null;
    }
    return (
        <div className="p-4 pt-8 relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setOpenSheet(null)}><X className="h-4 w-4" /></Button>
            {content}
        </div>
    )
  }

  const toggleSheet = (sheet: OpenSheet) => {
    if (openSheet === sheet) {
      setOpenSheet(null);
    } else {
      setOpenSheet(sheet);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 z-10">
        <div className="container mx-auto max-w-sm">
            <AnimatePresence>
              {openSheet === 'template' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2"
                >
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {templates.map(template => (
                        <div 
                            key={template.value}
                            className={cn(
                                "cursor-pointer border-2 rounded-lg overflow-hidden transition-all bg-background shadow-lg w-[100px] shrink-0",
                                designOptions.template === template.value ? "border-primary ring-2 ring-primary" : "border-transparent hover:border-primary/50"
                            )}
                            onClick={() => setDesignOptions(prev => ({...prev, template: template.value}))}
                        >
                            <div className="h-[140px] overflow-hidden bg-muted/30">
                              <div className="transform scale-[0.13] origin-top-left pointer-events-none">
                                  <ResumePreview 
                                      resumeData={resumeData}
                                      designOptions={{...designOptions, template: template.value}}
                                  />
                              </div>
                            </div>
                            <p className="text-xs text-center font-medium bg-muted/50 py-1">{template.name}</p>
                        </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
                {openSheet && openSheet !== 'template' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="mb-2 bg-background border rounded-lg shadow-lg"
                    >
                        {renderSheetContent()}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="p-1 bg-background border rounded-lg shadow-lg">
                <div className="grid grid-cols-4 gap-1">
                    <Button variant={openSheet === 'template' ? 'secondary' : 'ghost'} size="sm" className="text-xs" onClick={() => toggleSheet('template')}>
                        <Pen />
                        <span>Template</span>
                    </Button>
                    <Button variant={openSheet === 'color' ? 'secondary' : 'ghost'} size="sm" className="text-xs" onClick={() => toggleSheet('color')}>
                        <Palette />
                        <span>Color</span>
                    </Button>
                    <Button variant={openSheet === 'font' ? 'secondary' : 'ghost'} size="sm" className="text-xs" onClick={() => toggleSheet('font')}>
                        <Type />
                        <span>Font</span>
                    </Button>
                     <Button variant={openSheet === 'layout' ? 'secondary' : 'ghost'} size="sm" className="text-xs" onClick={() => toggleSheet('layout')}>
                        <Pilcrow />
                        <span>Layout</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
