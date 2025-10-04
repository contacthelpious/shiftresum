
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe, adminDb } from '@/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const weeklyPriceId = process.env.STRIPE_WEEKLY_PRICE_ID;
    const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!weeklyPriceId || !monthlyPriceId) {
        throw new Error("Server misconfiguration: Stripe Price IDs are not set in environment variables.");
    }

    const { priceId, userId, userEmail } = await req.json();

    if (!userId || !priceId || !userEmail) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
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
      metadata: {
          firebaseUID: userId, // Pass UID for both modes
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
