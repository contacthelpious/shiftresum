'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2, Briefcase, GraduationCap, Lightbulb, Star, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';


const floatingIcons = [
  { icon: Wand2, className: 'top-10 -left-5 bg-yellow-400 text-white', delay: 0 },
  { icon: Briefcase, className: 'top-1/3 -right-5 bg-blue-500 text-white', delay: 0.5 },
  { icon: GraduationCap, className: 'top-1/2 -left-8 bg-green-500 text-white', delay: 1 },
  { icon: Lightbulb, className: 'bottom-1/4 -right-4 bg-purple-500 text-white', delay: 1.5 },
  { icon: Star, className: 'bottom-10 -left-6 bg-pink-500 text-white', delay: 2 },
];


const FloatingIcon = ({ icon: Icon, className, delay }: { icon: React.ElementType, className: string, delay: number }) => (
  <motion.div
    className={cn("absolute h-10 w-10 rounded-lg shadow-lg flex items-center justify-center", className)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 + delay, duration: 0.5 }}
  >
    <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 + delay }}
    >
        <Icon className="h-6 w-6" />
    </motion.div>
  </motion.div>
);


export function AnimatedBuilderPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        >
            <Card className="shadow-2xl bg-background/80 backdrop-blur-sm">
                <CardHeader className="p-2 border-b">
                     <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-red-400"></span>
                        <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                        <span className="h-3 w-3 rounded-full bg-green-400"></span>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <div className="w-1/3 space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                             <div className="space-y-1 pt-4">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                        </div>
                        <div className="w-2/3 space-y-4">
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                             <div className="space-y-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                             <div className="space-y-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {floatingIcons.map((item, index) => (
            <FloatingIcon key={index} icon={item.icon} className={item.className} delay={item.delay} />
        ))}
    </div>
  );
}
