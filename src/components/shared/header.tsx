
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export function SharedHeader() {
    const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex-1 flex justify-start">
            <Link href="/">
                <Logo />
            </Link>
        </div>
        <nav className="hidden md:flex flex-1 justify-center">
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
        <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-2">
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
