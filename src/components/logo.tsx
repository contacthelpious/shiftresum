import { FileText } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Shift Resume logo">
      <FileText className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold text-primary font-headline">Shift Resume</span>
    </div>
  );
}
