
'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';

export function SubscriptionManagement() {
  const { user, isUserLoading, isPro, subData, isSubDataLoading } = useUser();
  const { toast } = useToast();
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!user) return;

    setIsPortalLoading(true);
    try {
        const response = await fetch('/api/stripe/create-portal-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid }),
        });

        if (!response.ok) {
            throw new Error('Failed to create portal session.');
        }

        const { url } = await response.json();
        window.location.href = url;
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Could not open management portal. Please try again.',
        });
        setIsPortalLoading(false);
    }
  };

  if (isUserLoading || isSubDataLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (!user) {
    return <p>Please log in to manage your subscription.</p>;
  }

  if (!isPro) {
    return (
        <div className="text-center space-y-4">
            <p className="text-muted-foreground">You are currently on the free plan.</p>
            <Button asChild>
                <Link href="/pricing">Upgrade to Pro</Link>
            </Button>
        </div>
    )
  }

  const subscriptionStatus = subData?.stripeSubscriptionStatus || 'unknown';
  const planName = subData?.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'Monthly' :
                   subData?.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID ? 'Weekly' :
                   'Pro';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-muted/50 flex justify-between items-center">
            <div>
            <h3 className="font-semibold">Current Plan</h3>
            <p className="text-sm text-muted-foreground">{planName}</p>
            </div>
            <Badge variant={subscriptionStatus === 'active' ? 'default': 'destructive'} className="capitalize bg-green-500 hover:bg-green-500/80">
                <Star className="mr-1 h-3 w-3" />
                {subscriptionStatus}
            </Badge>
        </div>
        {/* Placeholder for next billing date - would require more webhook logic */}
        {/* <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold">Next Billing Date</h3>
            <p className="text-sm text-muted-foreground">{mockSubscription.nextBillingDate}</p>
        </div> */}
      </div>
      <div>
        <Button onClick={handleManageSubscription} disabled={isPortalLoading}>
          {isPortalLoading && <Loader2 className="mr-2 animate-spin" />}
          Manage Subscription & Billing
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
            You will be redirected to our secure payment provider to manage your subscription details.
        </p>
      </div>
    </div>
  );
}
