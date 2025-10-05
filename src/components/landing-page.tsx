'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Palette, FileDown, FilePenLine, CheckCircle2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SharedHeader } from './shared/header';
import { SharedFooter } from './shared/footer';
import { useUser } from '@/firebase';
import { motion } from 'framer-motion';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
const ctaImage = PlaceHolderImages.find((img) => img.id === 'cta');

const features = [
  {
    icon: <Wand2 className="h-8 w-8 text-accent" />,
    title: 'AI-Powered Suggestions',
    description: 'Get real-time, intelligent feedback to make your resume stand out.',
  },
  {
    icon: <Palette className="h-8 w-8 text-accent" />,
    title: 'Template Customization',
    description: 'Choose from professional templates, fonts, and colors.',
  },
  {
    icon: <FileDown className="h-8 w-8 text-accent" />,
    title: 'Instant PDF Exports',
    description: 'Download a print-ready PDF of your resume with a single click.',
  },
  {
    icon: <FilePenLine className="h-8 w-8 text-accent" />,
    title: 'Intuitive Editor',
    description: 'Easily add and edit sections with a simple, clean interface.',
  },
];

const howItWorksSteps = [
    {
        icon: <FilePenLine className="h-10 w-10 text-accent" />,
        title: '1. Start with a Template',
        description: 'Begin with a blank slate on a professionally designed template.',
    },
    {
        icon: <Wand2 className="h-10 w-10 text-accent" />,
        title: '2. Edit with AI Assistance',
        description: 'Use our AI tools to generate summaries, descriptions, and skills, or fine-tune every detail yourself.',
    },
    {
        icon: <CheckCircle2 className="h-10 w-10 text-accent" />,
        title: '3. Download & Apply',
        description: 'Customize the design and export a professional PDF ready for job applications.',
    }
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPageContent() {
  const { user } = useUser();
  const ctaLink = user ? "/dashboard" : "/builder?resumeId=__new__";

  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <SharedHeader />

      <main className="flex-1 w-full flex flex-col items-center">
        <section className="container py-20 text-center md:py-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <h1 className="text-4xl font-bold tracking-tighter md:text-6xl font-headline">
              Build Your Best Resume, Faster
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Shift Resume combines a beautiful resume builder with AI to help you land your dream job. Create a professional resume in minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={ctaLink}>Create My Resume</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {heroImage && (
          <section className="container">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative overflow-hidden rounded-xl border bg-card shadow-lg"
            >
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={800}
                className="w-full"
                data-ai-hint={heroImage.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </motion.div>
          </section>
        )}

        <section id="features" className="container py-20 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl font-headline">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Our powerful features make resume building a breeze.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="text-center h-full transition-all hover:shadow-xl hover:-translate-y-1">
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
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-muted/50 py-20 md:py-32 w-full">
            <div className="container">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tighter font-headline">How It Works</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Get from zero to a perfect resume in three simple steps.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {howItWorksSteps.map((step, i) => (
                         <motion.div
                            key={step.title}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background border shadow-sm mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 font-headline">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {ctaImage && (
             <section className="py-20 md:py-32">
                <div className="container grid items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6 text-center lg:text-left"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl font-headline">Ready to Land Your Dream Job?</h2>
                        <p className="text-muted-foreground text-lg">
                           Stop wrestling with Word templates. Start building a resume that gets results.
                        </p>
                         <Button size="lg" asChild>
                            <Link href={ctaLink}>Get Started for Free</Link>
                        </Button>
                    </motion.div>
                     <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                     >
                        <Image
                            src={ctaImage.imageUrl}
                            alt={ctaImage.description}
                            width={600}
                            height={400}
                            className="w-full rounded-xl border bg-card shadow-lg"
                            data-ai-hint={ctaImage.imageHint}
                        />
                    </motion.div>
                </div>
            </section>
        )}

      </main>

      <SharedFooter />
    </div>
  );
}
