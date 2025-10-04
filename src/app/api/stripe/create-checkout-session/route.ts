
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, userEmail } = await req.json();

    if (!userId || !priceId || !userEmail) {
      console.error('Stripe Checkout Error: Missing userId, priceId, or userEmail', { userId, priceId, userEmail });
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }
    
    // Check for required server-side environment variables
    const weeklyPriceId = process.env.STRIPE_WEEKLY_PRICE_ID;
    if (!weeklyPriceId) {
        throw new Error("Server misconfiguration: STRIPE_WEEKLY_PRICE_ID is not set.");
    }

    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    let stripeCustomerId = userDoc.data()?.stripeCustomerId;

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

    let mode: 'subscription' | 'payment' = 'subscription';
    
    // The weekly plan is a one-time payment, not a subscription.
    if (priceId === weeklyPriceId) {
        mode = 'payment';
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode,
      success_url: `${baseUrl}/builder?resumeId=__new__&stripe=success`,
      cancel_url: `${baseUrl}/pricing?stripe=cancel`,
      // For subscriptions, metadata is on the subscription itself.
      // For one-time payments, metadata goes on the payment intent.
      ...(mode === 'subscription' ? {
          subscription_data: {
              metadata: {
                  firebaseUID: userId,
                  priceId: priceId,
              }
          }
      } : {
          payment_intent_data: {
              metadata: {
                  firebaseUID: userId,
                  priceId: priceId,
              }
          }
      })
    });
    
    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Stripe Checkout API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
