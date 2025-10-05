
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

const navLinks = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export function SharedHeader() {
    const pathname = usePathname();
    const { user, isUserLoading } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex w-1/3 justify-start">
            <Link href="/">
                <Logo />
            </Link>
        </div>
        <nav className="hidden md:flex w-1/3 justify-center">
            <ul className="flex items-center space-x-6">
                {navLinks.map(link => (
                    <li key={link.href}>
                        <Link href={link.href} className={cn("text-sm font-medium hover:text-primary", pathname === link.href ? "text-primary" : "text-muted-foreground")}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
        <div className="flex w-1/3 justify-end">
          {isUserLoading ? (
             <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : user ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
