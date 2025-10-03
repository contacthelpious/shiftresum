import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Palette, FileDown, History } from 'lucide-react';
import { Logo } from './logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { UploadResumeButton } from './upload-resume-button';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

const features = [
  {
    icon: <Wand2 className="h-8 w-8 text-accent" />,
    title: 'AI-Powered Suggestions',
    description: 'Get real-time, intelligent feedback to make your resume stand out.',
  },
  {
    icon: <Palette className="h-8 w-8 text-accent" />,
    title: 'Template Customization',
    description: 'Choose from a variety of professional templates, fonts, and colors.',
  },
  {
    icon: <FileDown className="h-8 w-8 text-accent" />,
    title: 'Instant PDF Exports',
    description: 'Download a print-ready PDF of your resume with a single click.',
  },
  {
    icon: <History className="h-8 w-8 text-accent" />,
    title: 'Version Control',
    description: 'Save and manage multiple versions of your resume for different jobs.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-20 text-center md:py-32">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter md:text-6xl font-headline">
              Build Your Best Resume, Faster
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              ResumeFlow combines a beautiful resume builder with AI to help you land your dream job. Create a professional resume in minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/builder">Create My Resume</Link>
              </Button>
              <UploadResumeButton />
            </div>
          </div>
        </section>

        {heroImage && (
          <section className="container">
            <div className="relative overflow-hidden rounded-xl border bg-card shadow-lg">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={800}
                className="w-full"
                data-ai-hint={heroImage.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </section>
        )}

        <section className="container py-20 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl font-headline">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Our powerful features make resume building a breeze.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center transition-all hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold font-headline">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex h-20 items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ResumeFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
