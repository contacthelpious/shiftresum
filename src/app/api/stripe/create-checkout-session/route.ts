
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/firebase/admin';
import { auth as adminAuth } from 'firebase-admin/auth';

// In Next.js 15, the request object itself is the body for POST requests
// when the 'Content-Type' is 'application/json'.
export async function POST(req: NextRequest & {
  priceId: string;
  userId: string;
  userEmail: string;
}) {
  try {
    const { priceId, userId, userEmail } = req;

    if (!userId || !priceId || !userEmail) {
      return new NextResponse('Missing userId, priceId, or userEmail', { status: 400 });
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
    
    // Construct the base URL from request headers
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const weeklyPriceId = process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID;
    const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;

    let session;

    // The checkout logic for weekly vs monthly plans seems to be swapped. Let's correct it.
    if (priceId === weeklyPriceId) {
        // This is a trial. The subscription itself is for the monthly plan,
        // but it starts with a trial period.
        session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // The recurring monthly price with a trial
                    quantity: 1,
                }
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 7, // The trial is defined on the price, but can be set here too.
                metadata: {
                    firebaseUID: userId,
                    // The actual recurring plan is the monthly one
                    priceId: monthlyPriceId,
                }
            },
            success_url: `${baseUrl}/builder?resumeId=__new__&stripe=success`,
            cancel_url: `${baseUrl}/builder?stripe=cancel`,
        });
    } else {
        // This is a direct subscription to the monthly plan without a trial.
        session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            subscription_data: {
                metadata: {
                    firebaseUID: userId,
                    priceId: priceId,
                }
            },
            success_url: `${baseUrl}/builder?resumeId=__new__&stripe=success`,
            cancel_url: `${baseUrl}/builder?stripe=cancel`,
        });
    }

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    // Return a proper JSON error response
    if (error instanceof Error) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
    return NextResponse.json({ error: { message: 'Internal Server Error' } }, { status: 500 });
  }
}
