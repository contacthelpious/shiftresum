
// This file is safe to import on the client, as it only contains public data.
// The server-side Stripe instance is now managed in `src/firebase/admin.ts`.

// IMPORTANT: The Price IDs are primarily managed via environment variables.
// This array is for display purposes on public-facing pages.
export const STRIPE_PRODUCTS = [
  {
    name: 'Weekly',
    // Use the public env variable for client-side access
    priceId: process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID || '', 
    price: '$3',
    priceAnnotation: 'AUD / week',
    description: 'A 7-day pass to try all Pro features.',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Suggestions',
      'All Templates & Colors',
      'PDF Downloads',
      'Remove "Shift Resume" Branding',
    ],
    cta: 'Start Trial',
  },
  {
    name: 'Monthly',
    // Use the public env variable for client-side access
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '',
    price: '$12',
    priceAnnotation: 'AUD / month',
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
