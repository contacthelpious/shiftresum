
'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DesignOptions } from '@/lib/definitions';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Palette, Pen, Type, X } from 'lucide-react';

interface TemplateCustomizerProps {
  designOptions: DesignOptions;
  setDesignOptions: Dispatch<SetStateAction<DesignOptions>>;
}

const colors = [
  { name: 'Default Blue', value: '#2c3e50' },
  { name: 'Graphite', value: '#34495e' },
  { name: 'Forest Green', value: '#27ae60' },
  { name: 'Deep Purple', value: '#8e44ad' },
  { name: 'Crimson', value: '#c0392b' },
  { name: 'Modern Teal', value: '#16a085' },
];

const fonts = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Lato', value: 'Lato' },
];

type OpenSheet = 'template' | 'color' | 'font' | null;

export function TemplateCustomizer({ designOptions, setDesignOptions }: TemplateCustomizerProps) {
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);

  const renderSheetContent = () => {
    let content;
    switch (openSheet) {
      case 'template':
        content = (
          <>
            <h3 className="font-semibold mb-4">Template</h3>
            <Select
              value={designOptions.template}
              onValueChange={(value) => setDesignOptions(prev => ({...prev, template: value as 'modern' | 'classic' | 'compact'}))}
            >
              <SelectTrigger><SelectValue placeholder="Select a template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
        break;
      case 'color':
        content = (
          <>
            <h3 className="font-semibold mb-4">Accent Color</h3>
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
          </>
        );
        break;
      case 'font':
        content = (
          <>
            <h3 className="font-semibold mb-4">Typography</h3>
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                 value={designOptions.font}
                 onValueChange={(value) => setDesignOptions(prev => ({...prev, font: value as 'Inter' | 'Roboto' | 'Lato'}))}
              >
                <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
                <SelectContent>
                  {fonts.map(font => (
                    <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
        break;
      default:
        return null;
    }
    return (
        <div className="p-4 relative">
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
        <div className="container mx-auto max-w-[280px]">
            <AnimatePresence>
                {openSheet && (
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
                <div className="grid grid-cols-3 gap-1">
                    <Button variant={openSheet === 'template' ? 'secondary' : 'ghost'} className="flex-col h-11 text-xs" onClick={() => toggleSheet('template')}>
                        <Pen className="mb-1 h-3 w-3"/>
                        <span>Template</span>
                    </Button>
                    <Button variant={openSheet === 'color' ? 'secondary' : 'ghost'} className="flex-col h-11 text-xs" onClick={() => toggleSheet('color')}>
                        <Palette className="mb-1 h-3 w-3" />
                        <span>Color</span>
                    </Button>
                    <Button variant={openSheet === 'font' ? 'secondary' : 'ghost'} className="flex-col h-11 text-xs" onClick={() => toggleSheet('font')}>
                        <Type className="mb-1 h-3 w-3" />
                        <span>Font</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
