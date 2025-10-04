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
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/builder?resumeId=__new__&stripe=success`, // Placeholder, will be adjusted
      cancel_url: `${baseUrl}/builder?stripe=cancel`,
      metadata: {
        firebaseUID: userId,
        priceId: priceId,
      }
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
