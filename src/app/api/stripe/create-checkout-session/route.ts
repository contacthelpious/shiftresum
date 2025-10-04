
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe, adminDb, STRIPE_MONTHLY_PRICE_ID, STRIPE_WEEKLY_PRICE_ID } from '@/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, userId, userEmail } = body;

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

    const host = req.headers.get('origin')!;
    
    const mode: 'subscription' | 'payment' = priceId === STRIPE_MONTHLY_PRICE_ID ? 'subscription' : 'payment';

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode,
      success_url: `${host}/builder?resumeId=__new__&stripe=success`,
      cancel_url: `${host}/builder?resumeId=__new__&stripe=cancel`,
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
    
    // Return the session ID to the client
    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error('Stripe Checkout API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal server error occurred.';
    // ALWAYS return a JSON error response
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
