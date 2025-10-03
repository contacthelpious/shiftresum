
'use client';

import { useUser } from '@/firebase';
import { Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// In a real app, this would come from Firestore or your backend
const mockSubscription = {
  plan: 'Monthly',
  status: 'Active',
  nextBillingDate: 'July 30, 2024',
};

export function SubscriptionManagement() {
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const handleManageSubscription = () => {
    toast({
      title: 'Redirecting...',
      description: 'You are being redirected to our payment provider to manage your subscription.',
    });
    // In a real app, you would use the Stripe Customer Portal link here.
    // Example: window.location.href = 'https://billing.stripe.com/p/session...';
    console.log('Redirecting to payment provider...');
  };

  if (isUserLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (!user) {
    return <p>Please log in to manage your subscription.</p>;
  }

  // Placeholder for subscription status.
  // In a real app, you'd fetch this from your database based on the user's ID.
  const hasSubscription = true; 

  if (!hasSubscription) {
    return (
        <div className="text-center">
            <p className="text-muted-foreground">You are currently on the free plan.</p>
            <Button className="mt-4">Upgrade to Pro</Button>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-muted/50 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Current Plan</h3>
          <p className="text-sm text-muted-foreground">{mockSubscription.plan}</p>
        </div>
        <Badge variant={mockSubscription.status === 'Active' ? 'default': 'destructive'} className="bg-green-500 hover:bg-green-500/80">
            <Star className="mr-1 h-3 w-3" />
            {mockSubscription.status}
        </Badge>
      </div>
      <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold">Next Billing Date</h3>
          <p className="text-sm text-muted-foreground">{mockSubscription.nextBillingDate}</p>
      </div>
      <div>
        <Button onClick={handleManageSubscription}>
          Manage Subscription & Billing
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
            You will be redirected to our secure payment provider to manage your subscription details.
        </p>
      </div>
    </div>
  );
}
