'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new NextResponse('Missing userId', { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      return new NextResponse('Stripe customer ID not found for user', { status: 400 });
    }
    
    const baseUrl = req.nextUrl.origin;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/dashboard/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error) {
    console.error('Stripe Portal Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
