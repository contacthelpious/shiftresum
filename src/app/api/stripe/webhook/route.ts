'use server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/firebase/admin';
import { auth as adminAuth } from 'firebase-admin/auth';
import { headers } from 'next/headers'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

async function updateUserSubscription(subscription: Stripe.Subscription, priceId: string) {
    const firebaseUID = subscription.metadata.firebaseUID;
    if (!firebaseUID) {
        console.error('No firebaseUID in subscription metadata');
        return;
    }

    const userRef = adminDb.collection('users').doc(firebaseUID);
    
    const dataToSet = {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
        stripePriceId: priceId,
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
      return new NextResponse('Webhook secret not configured', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            if (!session.subscription || !session.metadata?.firebaseUID) {
                throw new Error('Missing subscription or firebaseUID on session');
            }
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            const priceId = session.metadata.priceId;
            await updateUserSubscription(subscription, priceId);
            break;
        }
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const priceId = subscription.items.data[0].price.id;
            await updateUserSubscription(subscription, priceId);
            break;
        }
        default:
            throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error(error);
      return new NextResponse('Webhook handler failed', { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}
