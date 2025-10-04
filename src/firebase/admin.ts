
'use server';
import 'dotenv/config'; // Ensure all env variables are loaded at the start
import admin from 'firebase-admin';
import Stripe from 'stripe';
import { auth as adminAuth } from 'firebase-admin/auth';
import { firestore as adminFirestore } from 'firebase-admin';


// --- FIREBASE ADMIN INITIALIZATION ---
// Correctly format the private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

export const adminDb = admin.firestore();
export { adminAuth, adminFirestore };


// --- STRIPE ADMIN INITIALIZATION ---

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not set in the environment variables.');
  throw new Error('Stripe configuration error: Secret key is missing.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
  typescript: true,
});

// Export Price IDs for server-side use
export const STRIPE_WEEKLY_PRICE_ID = process.env.STRIPE_WEEKLY_PRICE_ID;
export const STRIPE_MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID;

if (!STRIPE_WEEKLY_PRICE_ID || !STRIPE_MONTHLY_PRICE_ID) {
    console.error("Stripe Price IDs (STRIPE_WEEKLY_PRICE_ID, STRIPE_MONTHLY_PRICE_ID) are not set in environment variables.");
    throw new Error('Stripe configuration error: Price IDs are missing.');
}
