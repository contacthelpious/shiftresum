
'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DesignOptions } from '@/lib/definitions';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Palette, Pen, Type } from 'lucide-react';

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
    switch (openSheet) {
      case 'template':
        return (
          <>
            <SheetHeader><SheetTitle>Template</SheetTitle></SheetHeader>
            <div className="p-4">
              <Select
                value={designOptions.template}
                onValueChange={(value) => setDesignOptions(prev => ({...prev, template: value as 'classic' | 'modern'}))}
              >
                <SelectTrigger><SelectValue placeholder="Select a template" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic" disabled>Classic (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'color':
        return (
          <>
            <SheetHeader><SheetTitle>Accent Color</SheetTitle></SheetHeader>
            <div className="p-4 flex flex-wrap gap-3 justify-center">
              {colors.map(color => (
                <button
                  key={color.value}
                  title={color.name}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${designOptions.color === color.value ? 'border-primary ring-2 ring-ring ring-offset-2' : 'border-transparent'}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setDesignOptions(prev => ({...prev, color: color.value}))}
                />
              ))}
            </div>
          </>
        );
      case 'font':
        return (
          <>
            <SheetHeader><SheetTitle>Typography</SheetTitle></SheetHeader>
            <div className="p-4 space-y-4">
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
      default:
        return null;
    }
  }

  return (
    <Sheet open={!!openSheet} onOpenChange={(isOpen) => !isOpen && setOpenSheet(null)}>
      <div className="fixed bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm border-t z-10">
        <div className="container mx-auto max-w-xs">
          <div className="grid grid-cols-3 gap-1">
            <SheetTrigger asChild onClick={() => setOpenSheet('template')}>
              <Button variant="outline" className="flex-col h-14 text-xs">
                <Pen className="mb-1 h-4 w-4"/>
                <span>Template</span>
              </Button>
            </SheetTrigger>
            <SheetTrigger asChild onClick={() => setOpenSheet('color')}>
              <Button variant="outline" className="flex-col h-14 text-xs">
                <Palette className="mb-1 h-4 w-4" />
                <span>Color</span>
              </Button>
            </SheetTrigger>
            <SheetTrigger asChild onClick={() => setOpenSheet('font')}>
              <Button variant="outline" className="flex-col h-14 text-xs">
                <Type className="mb-1 h-4 w-4" />
                <span>Font</span>
              </Button>
            </SheetTrigger>
          </div>
        </div>
      </div>
      <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-lg h-auto max-h-[40vh]">
        {renderSheetContent()}
      </SheetContent>
    </Sheet>
  );
}
