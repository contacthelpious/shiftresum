
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/firebase/admin';
import { auth as adminAuth } from 'firebase-admin/auth';

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, userEmail } = await req.json();

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
    
    const baseUrl = req.nextUrl.origin;
    
    const weeklyPriceId = process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID;
    const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;

    let session;

    if (priceId === weeklyPriceId) {
        // This is a trial. Subscribe them to the MONTHLY plan with a 7-day trial
        // and add a one-time charge for the trial week.
        session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: weeklyPriceId, // The one-time price for the trial
                    quantity: 1,
                },
                {
                    price: monthlyPriceId, // The recurring monthly price
                    quantity: 1,
                }
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 7,
                metadata: {
                    firebaseUID: userId,
                    priceId: monthlyPriceId, // Store the actual plan price ID
                }
            },
            success_url: `${baseUrl}/builder?resumeId=__new__&stripe=success`,
            cancel_url: `${baseUrl}/builder?stripe=cancel`,
        });
    } else {
        // This is a direct subscription to the monthly plan.
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
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
