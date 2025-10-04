
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
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
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PRODUCTS } from '@/lib/stripe';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type View = 'auth' | 'pricing' | 'confirm' | 'loading';

interface AuthGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed: () => void;
}

export function AuthGate({ isOpen, onClose, onSubscribed }: AuthGateProps) {
  const { user, isUserLoading, isPro, isSubDataLoading } = useUser();
  const { toast } = useToast();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [view, setView] = useState<View>('loading');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (isUserLoading || isSubDataLoading) {
      setView('loading');
    } else if (!user) {
      // User is not logged in, show auth forms but also prepare to redirect.
      const currentPath = `${pathname}?${searchParams.toString()}`;
      sessionStorage.setItem('loginRedirect', currentPath);
      setView('auth');
    } else if (!isPro) {
      setView('pricing');
    } else {
      setView('confirm');
    }
  }, [isOpen, isUserLoading, isSubDataLoading, user, isPro, pathname, searchParams]);


  const handleAuthSuccess = () => {
    // After login/signup, the useEffect hook above will automatically
    // re-evaluate the view based on the new user's subscription status.
    const redirectUrl = sessionStorage.getItem('loginRedirect');
    if (redirectUrl) {
        // We don't remove the item here, because the user might still need to complete an action
        // on the page they are redirected back to (like subscribing).
        router.push(redirectUrl);
    } else {
        router.push('/dashboard');
    }
  };
  
  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in to subscribe.' });
       const currentPath = `${pathname}?${searchParams.toString()}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsSubscribing(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceId, userId: user.uid, userEmail: user.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session.');
      }

      const { sessionId } = await response.json();
      if (!sessionId) {
        throw new Error('Failed to retrieve checkout session ID.');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }

      await stripe.redirectToCheckout({ sessionId });
      // The user will be redirected to the success/cancel URL defined in the API route.
      
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Subscription Error',
        description: error.message || 'Could not initiate subscription. Please try again.',
      });
      setIsSubscribing(false);
    }
  };

  const handleConfirmedDownload = () => {
    onSubscribed();
    onClose();
  }

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        );
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
              {STRIPE_PRODUCTS.map((tier) => (
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
                      {tier.features.map((feature, i) => (
                        <li key={`${tier.name}-feature-${i}`} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleSubscribe(tier.priceId)} className="w-full" variant={tier.popular ? 'default' : 'outline'} disabled={isSubscribing}>
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
              <Button onClick={handleConfirmedDownload} size="lg">
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
