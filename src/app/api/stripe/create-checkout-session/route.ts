
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe, adminDb } from '@/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const weeklyPriceId = process.env.STRIPE_WEEKLY_PRICE_ID;
    const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!weeklyPriceId || !monthlyPriceId) {
      console.error("Stripe Price IDs are not set in server environment variables.");
      return NextResponse.json({ error: "Server misconfiguration: Stripe price IDs are missing." }, { status: 500 });
    }

    const { priceId, userId, userEmail } = await req.json();

    if (!userId || !priceId || !userEmail) {
      return NextResponse.json({ error: 'Missing required parameters: userId, priceId, or userEmail.' }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    let stripeCustomerId = userDoc.data()?.stripeCustomerId;

    // Create a new Stripe customer if one doesn't exist
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

    const host = req.headers.get('host')!;
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    // Determine if the plan is a one-time payment or a subscription
    const mode: 'subscription' | 'payment' = priceId === weeklyPriceId ? 'payment' : 'subscription';

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode,
      success_url: `${baseUrl}/builder?resumeId=__new__&stripe=success`,
      cancel_url: `${baseUrl}/builder?resumeId=__new__&stripe=cancel`,
      metadata: {
          firebaseUID: userId,
      },
      ...(mode === 'subscription' ? {
          subscription_data: {
              metadata: {
                  firebaseUID: userId,
              }
          }
      } : {
          payment_intent_data: {
              metadata: {
                  firebaseUID: userId,
              }
          }
      })
    });
    
    if (!session.id) {
        throw new Error("Stripe session creation failed: No session ID returned.");
    }
    
    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Stripe Checkout API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
