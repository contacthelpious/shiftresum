
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

// IMPORTANT: Replace these with your actual Price IDs from your Stripe Dashboard
export const STRIPE_PRODUCTS = [
  {
    name: 'Weekly',
    priceId: process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID || 'price_123_weekly', // This now represents the trial
    price: '$2',
    priceAnnotation: '/ week',
    description: 'A 7-day trial that auto-renews to the monthly plan.',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Suggestions',
      'All Templates & Colors',
      'PDF Downloads',
      'Remove "Shift Resume" Branding',
      'Priority Support',
    ],
    cta: 'Start Trial',
  },
  {
    name: 'Monthly',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || 'price_123_monthly', // Replace with your ID
    price: '$10',
    priceAnnotation: '/ month',
    description: 'Unlock all features and build unlimited resumes.',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Suggestions',
      'All Templates & Colors',
      'PDF Downloads',
      'Remove "Shift Resume" Branding',
      'Priority Support',
    ],
    cta: 'Go Pro',
    popular: true,
  },
];
