'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DesignOptions } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export function TemplateCustomizer({ designOptions, setDesignOptions }: TemplateCustomizerProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Template</CardTitle></CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Accent Color</CardTitle></CardHeader>
        <CardContent>
           <div className="flex flex-wrap gap-3">
            {colors.map(color => (
              <button
                key={color.value}
                title={color.name}
                className={`h-8 w-8 rounded-full border-2 transition-all ${designOptions.color === color.value ? 'border-primary scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setDesignOptions(prev => ({...prev, color: color.value}))}
              />
            ))}
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Typography</CardTitle></CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
