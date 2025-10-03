
import { Logo } from '@/components/logo';
import Link from 'next/link';

export function SharedFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3 space-y-4">
             <Logo />
             <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} ResumeFlow. All rights reserved.</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link href="/builder" className="text-muted-foreground hover:text-primary">Builder</Link></li>
                <li><Link href="/#features" className="text-muted-foreground hover:text-primary">Features</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
           <div className="md:col-span-2">
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
