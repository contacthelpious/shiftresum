'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';
import { SharedHeader } from './shared/header';
import { SharedFooter } from './shared/footer';
import { useUser } from '@/firebase';
import { motion } from 'framer-motion';
import { AnimatedBuilderPreview } from './builder/animated-builder-preview';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


const AnimatedWord = ({ text, delay }: { text: string; delay: number }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay + i * 0.03 },
    }),
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className="inline-block"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child} className="inline-block">
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};


const HeroSection = () => {
    const { user } = useUser();
    const buildLink = user ? "/dashboard" : "/builder?resumeId=__new__";
    const uploadLink = user ? "/dashboard" : "/login"; // Force login for upload if not authenticated

    return (
         <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                PROFESSIONAL AI RESUME BUILDER
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline">
              Craft your professional resume <br/>
              <span className="text-primary"><AnimatedWord text="in minutes" delay={0.5}/></span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Try our free resume builder and create a stunning resume with the power of AI. Let our platform help you build your resume quickly and effortlessly.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href={buildLink}>Build My Resume Now</Link>
              </Button>
               <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href={uploadLink}>Upload Existing Resume</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://picsum.photos/seed/1/100" alt="User" data-ai-hint="person face" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://picsum.photos/seed/2/100" alt="User" data-ai-hint="person face" />
                        <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://picsum.photos/seed/3/100" alt="User" data-ai-hint="person face" />
                        <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                </div>
                 <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">6+</span> Resume & Career Experts
                </div>
            </div>
             <div className="mt-4 flex items-center gap-2">
                <span className="font-semibold">Trustpilot</span>
                <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                </div>
                <span className="text-sm font-semibold">4.5</span>
            </div>

          </motion.div>
          
          <div className="hidden lg:block">
            <AnimatedBuilderPreview />
          </div>
        </section>
    )
}


export function LandingPageContent() {
  return (
    <div className="flex min-h-screen flex-col bg-background items-center">
      <SharedHeader />

      <main className="flex-1 w-full flex flex-col items-center">
        <HeroSection />
        {/* Other sections can be added here */}
      </main>

      <SharedFooter />
    </div>
  );
}
