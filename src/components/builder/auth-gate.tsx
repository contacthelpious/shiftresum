'use client';

import { useState } from 'react';
import { useUser, useAuth } from '@/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { useToast } from '@/hooks/use-toast';

interface AuthGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed: () => void;
}

const tiers = [
  {
    name: 'Weekly',
    price: '$2',
    priceAnnotation: '/ week',
    description: 'Try out all the Pro features for a week.',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Suggestions',
      'All Templates & Colors',
      'PDF Downloads',
      'Remove "Shift Resume" Branding',
      'Priority Support',
    ],
    cta: 'Start Trial',
  },
  {
    name: 'Monthly',
    price: '$10',
    priceAnnotation: '/ month',
    description: 'Unlock all features and build unlimited resumes.',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Suggestions',
      'All Templates & Colors',
      'PDF Downloads',
      'Remove "Shift Resume" Branding',
      'Priority Support',
    ],
    cta: 'Go Pro',
    popular: true,
  },
];

type View = 'auth' | 'pricing' | 'confirm';

export function AuthGate({ isOpen, onClose, onSubscribed }: AuthGateProps) {
  const { user, isUserLoading } = useUser();
  // This is a placeholder. In a real app, you'd get this from your backend/Firestore.
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleAuthSuccess = () => {
    // After login/signup, if they don't have a sub, show pricing.
    // We use a timeout to allow the user state to propagate.
    setTimeout(() => {
      if (!hasSubscription) {
        setView('pricing');
      } else {
        onSubscribed();
      }
    }, 500);
  };
  
  const handleSubscribe = (planName: string) => {
    setIsSubscribing(true);
    // Mock subscription logic
    console.log(`Subscribing to ${planName}`);
    setTimeout(() => {
      setHasSubscription(true);
      toast({
        title: 'Subscription Successful!',
        description: `You are now subscribed to the ${planName} plan.`,
      });
      setIsSubscribing(false);
      onSubscribed();
    }, 1500);
  };

  const getInitialView = (): View => {
    if (isUserLoading) return 'auth';
    if (!user) return 'auth';
    if (!hasSubscription) return 'pricing';
    return 'confirm';
  }
  
  const [view, setView] = useState<View>(getInitialView());

  // Determine view when dialog opens or user state changes
  useState(() => {
      setView(getInitialView());
  });

  const renderContent = () => {
    if (isUserLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    switch (view) {
      case 'auth':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Create an account or log in</DialogTitle>
              <DialogDescription>
                Save your progress and access your resume anytime.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Log In</TabsTrigger>
              </TabsList>
              <TabsContent value="signup">
                <SignupForm onSuccess={handleAuthSuccess} />
              </TabsContent>
              <TabsContent value="login">
                <LoginForm onSuccess={handleAuthSuccess} />
              </TabsContent>
            </Tabs>
          </>
        );
      case 'pricing':
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle>Unlock PDF Downloads</DialogTitle>
              <DialogDescription>
                Choose a plan to export your resume and unlock all pro features.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mt-4 sm:grid-cols-2">
              {tiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary ring-2 ring-primary' : ''}`}>
                   {tier.popular && (
                      <div className="text-center py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-t-lg">Most Popular</div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{tier.name}</CardTitle>
                    <div className="pt-2">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      {tier.priceAnnotation && <span className="text-muted-foreground">{tier.priceAnnotation}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 text-sm">
                     <p className="text-muted-foreground mb-4">{tier.description}</p>
                    <ul className="space-y-2">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleSubscribe(tier.name)} className="w-full" variant={tier.popular ? 'default' : 'outline'} disabled={isSubscribing}>
                      {isSubscribing ? <Loader2 className="animate-spin" /> : tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        );
       case 'confirm':
        return (
          <>
            <DialogHeader className="text-center">
              <DialogTitle>Ready to Download</DialogTitle>
              <DialogDescription>
                You have an active subscription. Your download will start shortly.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center p-8">
              <Button onClick={onSubscribed} size="lg">
                <Download className="mr-2" />
                Download PDF
              </Button>
            </div>
          </>
        );
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
