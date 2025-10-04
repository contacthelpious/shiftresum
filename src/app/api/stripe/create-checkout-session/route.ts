
'use server';
// Force load environment variables at the very beginning of this serverless function's execution
import 'dotenv/config'; 
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    // **1. Validate Environment Variables & Initialize Stripe**
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("Stripe configuration error: Missing STRIPE_SECRET_KEY.");
      return NextResponse.json({ error: 'Server configuration error. Please contact support.' }, { status: 500 });
    }
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });

    // **2. Define Price IDs**
    // Using NEXT_PUBLIC_ variables as they are accessible here.
    const weeklyPriceId = process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID!;
    const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!;

    if (!weeklyPriceId || !monthlyPriceId) {
        console.error("Stripe configuration error: Missing Price IDs.");
        return NextResponse.json({ error: 'Server configuration error. Please contact support.' }, { status: 500 });
    }

    // **3. Parse Request Body**
    const body = await req.json();
    const { priceId, userId, userEmail } = body;

    if (!userId || !priceId || !userEmail) {
      return NextResponse.json({ error: 'Missing required parameters: userId, priceId, or userEmail.' }, { status: 400 });
    }
    
    // **4. Find or Create Stripe Customer**
    // Simplified for robustness: create customer every time.
    // A proper implementation would fetch from Firestore.
    const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          firebaseUID: userId,
        },
    });
    const stripeCustomerId = customer.id;

    // **5. Determine Session Mode and Create Checkout Session**
    const host = req.headers.get('origin')!;
    
    // **THE FIX**: Explicitly check which price ID is being used to set the mode.
    let mode: 'payment' | 'subscription';
    if (priceId === monthlyPriceId) {
        mode = 'subscription';
    } else if (priceId === weeklyPriceId) {
        mode = 'payment'; // Weekly is a one-time payment
    } else {
        return NextResponse.json({ error: `Invalid priceId: ${priceId}` }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode,
      success_url: `${host}/builder?resumeId=__new__&stripe=success`,
      cancel_url: `${host}/builder?resumeId=__new__&stripe=cancel`,
      metadata: {
        firebaseUID: userId,
        priceId: priceId, // Pass priceId for the webhook
      },
    });
    
    if (!session.id) {
        throw new Error("Stripe session creation failed: No session ID returned.");
    }
    
    // **6. Return Success Response**
    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    // **7. Catch-All Error Handling**
    console.error('Stripe Checkout API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
