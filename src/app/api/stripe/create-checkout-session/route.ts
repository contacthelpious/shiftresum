
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, userEmail } = await req.json();

    if (!userId || !priceId || !userEmail) {
      console.error('Stripe Checkout Error: Missing userId, priceId, or userEmail', { userId, priceId, userEmail });
      return NextResponse.json({ error: { message: 'Missing required parameters: userId, priceId, or userEmail' } }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    let stripeCustomerId = userDoc.data()?.stripeCustomerId;

    // Create a Stripe customer if one doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userEmail.split('@')[0],
        metadata: {
          firebaseUID: userId,
        },
      });
      stripeCustomerId = customer.id;
      await userRef.set({ stripeCustomerId }, { merge: true });
    }
    
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const weeklyPriceId = process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID;
    const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;

    let session;
    const lineItems = [{ price: priceId, quantity: 1 }];
    let mode: 'subscription' | 'payment' = 'subscription';
    let subscriptionData: any = {
        metadata: {
            firebaseUID: userId,
            priceId: priceId, // Store the actual price ID being purchased
        }
    };

    // Special handling for the weekly "trial" which is modeled as a one-time payment
    // that grants access, but doesn't create a recurring subscription itself.
    // The webhook would need logic to handle the end of this trial period.
    // For now, we will treat it as a one-time payment, not a subscription trial.
    if (priceId === weeklyPriceId) {
        mode = 'payment'; // Treat weekly as a one-time purchase
        // No subscription_data for one-time payments
        subscriptionData = undefined;
    }

    session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: mode,
        subscription_data: subscriptionData,
        success_url: `${baseUrl}/builder?resumeId=__new__&stripe=success`,
        cancel_url: `${baseUrl}/pricing?stripe=cancel`,
        metadata: {
           firebaseUID: userId,
           priceId: priceId
        }
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Stripe Checkout API Error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: { message: `Internal Server Error: ${error.message}` } }, { status: 500 });
    }
    return NextResponse.json({ error: { message: 'An unknown internal server error occurred.' } }, { status: 500 });
  }
}
