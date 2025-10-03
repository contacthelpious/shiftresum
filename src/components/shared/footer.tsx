
import { Logo } from '@/components/logo';
import Link from 'next/link';

export function SharedFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="flex flex-col items-center gap-8 text-center">
            <Logo />
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                <Link href="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link>
                <Link href="/builder" className="text-muted-foreground hover:text-primary">Builder</Link>
                <Link href="/#features" className="text-muted-foreground hover:text-primary">Features</Link>
                <Link href="/about" className="text-muted-foreground hover:text-primary">About</Link>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
            </div>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} ResumeFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
