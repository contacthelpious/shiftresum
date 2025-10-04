
'use server';
// Force load environment variables at the very beginning of this serverless function's execution
import 'dotenv/config'; 
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    // **1. Validate Environment Variables**
    // This is the most critical step. If these are missing, the API would crash.
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const weeklyPriceId = process.env.STRIPE_WEEKLY_PRICE_ID;
    const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!stripeSecretKey || !weeklyPriceId || !monthlyPriceId) {
      console.error("Stripe configuration error: Missing environment variables.");
      // Explicitly return a JSON error instead of crashing
      return NextResponse.json({ error: 'Server configuration error. Please contact support.' }, { status: 500 });
    }

    // **2. Initialize Stripe SDK Locally**
    // Initialize Stripe inside the handler to ensure it only happens when this API is called.
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });

    // **3. Parse Request Body**
    const body = await req.json();
    const { priceId, userId, userEmail } = body;

    if (!userId || !priceId || !userEmail) {
      return NextResponse.json({ error: 'Missing required parameters: userId, priceId, or userEmail.' }, { status: 400 });
    }
    
    // **4. Find or Create Stripe Customer**
    // This logic remains crucial. We check if the user already has a Stripe Customer ID.
    // Note: This requires Firebase Admin setup, but we'll assume the userRef logic is a placeholder
    // for however the customer ID is stored. For now, we'll create a new customer every time
    // to ensure this part of the logic doesn't fail. A real implementation would fetch this from a database.
    
    // Simplified for robustness: create customer every time for this test.
    // A proper implementation would fetch from `adminDb.collection('users').doc(userId).get()`
    const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          firebaseUID: userId,
        },
    });
    const stripeCustomerId = customer.id;


    // **5. Determine Session Mode and Create Checkout Session**
    const host = req.headers.get('origin')!;
    const mode = priceId === monthlyPriceId ? 'subscription' : 'payment';

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
    });
    
    if (!session.id) {
        throw new Error("Stripe session creation failed: No session ID returned.");
    }
    
    // **6. Return Success Response**
    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    // **7. Catch-All Error Handling**
    // This block ensures that no matter what goes wrong inside the `try` block,
    // we ALWAYS return a clean JSON error response, which will prevent the DOCTYPE error.
    console.error('Stripe Checkout API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
