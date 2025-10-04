
'use server';
import 'dotenv/config'; // Ensure env vars are loaded for webhooks too.
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { adminDb } from '@/firebase/admin';
import { auth as adminAuth } from 'firebase-admin/auth';
import { firestore as adminFirestore } from 'firebase-admin';
import { headers } from 'next/headers'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'payment_intent.succeeded'
]);

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
    const firebaseUID = subscription.metadata.firebaseUID;
    if (!firebaseUID) {
        console.error('No firebaseUID in subscription metadata');
        return;
    }

    const userRef = adminDb.collection('users').doc(firebaseUID);
    
    const dataToSet = {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubscriptionStatus: subscription.status,
    };

    await userRef.set(dataToSet, { merge: true });

    // Set custom claim for pro status
    const isPro = subscription.status === 'active' || subscription.status === 'trialing';
    await adminAuth().setCustomUserClaims(firebaseUID, { pro: isPro });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
      console.error('Webhook secret not configured.');
      return new NextResponse('Webhook secret not configured', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const STRIPE_WEEKLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID;
            // Handle one-time payments (like the weekly pass)
            if (session.mode === 'payment' && session.payment_intent) {
                 const firebaseUID = session.metadata?.firebaseUID;
                 if (!firebaseUID) throw new Error('Missing firebaseUID on payment session metadata');

                 const userRef = adminDb.collection('users').doc(firebaseUID);
                 
                 await userRef.set({
                    stripeCustomerId: session.customer,
                    stripePriceId: STRIPE_WEEKLY_PRICE_ID, // Assuming this session is for the weekly pass
                    stripeSubscriptionStatus: 'active', // Treat it as active for the duration
                    proUntil: adminFirestore.Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                 }, { merge: true });
                 await adminAuth().setCustomUserClaims(firebaseUID, { pro: true });

            // Handle subscriptions
            } else if (session.mode === 'subscription' && session.subscription) {
                const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
                await handleSubscriptionChange(subscription);
            }
            break;
        }
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionChange(subscription);
            break;
        }
        default:
            // Do nothing for other events
      }
    } catch (error) {
      console.error('Webhook handler failed:', error);
      return new NextResponse('Webhook handler failed', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
