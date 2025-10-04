
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PRODUCTS } from '@/lib/stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      sessionStorage.setItem('loginRedirect', '/pricing');
      router.push('/login');
      return;
    }

    setIsSubscribing(true);
    setSelectedPriceId(priceId);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: user.uid, userEmail: user.email }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || 'Failed to create checkout session.');
      }
      
      const { sessionId } = body;
      if (!sessionId) {
        throw new Error('Failed to retrieve checkout session ID.');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
       if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Subscription Error',
        description: error.message || 'Could not initiate subscription. Please try again.',
      });
      setIsSubscribing(false);
      setSelectedPriceId(null);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <main className="container py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tighter md:text-6xl font-headline">
            Find the Perfect Plan
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Start for free, then upgrade to unlock powerful features to accelerate your job search.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
          {STRIPE_PRODUCTS.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary ring-2 ring-primary' : ''}`}>
              {tier.popular && (
                  <div className="text-center py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg">Most Popular</div>
              )}
              <CardHeader className="flex-1">
                <CardTitle className="font-headline">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.priceAnnotation && <span className="text-muted-foreground">{tier.priceAnnotation}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                 <Button 
                    onClick={() => handleSubscribe(tier.priceId)} 
                    className="w-full" 
                    variant={tier.popular ? 'default' : 'outline'}
                    disabled={isUserLoading || isSubscribing}
                  >
                    {(isSubscribing && selectedPriceId === tier.priceId) || isUserLoading ? <Loader2 className="animate-spin" /> : tier.cta}
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
