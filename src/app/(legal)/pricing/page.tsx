
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started and create your first resume.',
    features: [
      '1 Resume',
      'AI Suggestions (3 per day)',
      '5 Templates',
      'PDF Export',
    ],
    cta: 'Get Started',
    href: '/signup'
  },
  {
    name: 'Monthly',
    price: '$10',
    priceAnnotation: '/ month',
    description: 'Unlock all features and build unlimited resumes.',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Suggestions',
      'All Templates & Colors',
      'Remove "ResumeFlow" Branding',
      'Priority Support',
    ],
    cta: 'Go Pro',
    href: '/signup',
    popular: true,
  },
  {
    name: 'Weekly',
    price: '$2',
    priceAnnotation: '/ week',
    description: 'Try out all the Pro features for a week.',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Suggestions',
      'All Templates & Colors',
      'Remove "ResumeFlow" Branding',
      'Priority Support',
    ],
    cta: 'Start Trial',
    href: '/signup'
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tighter md:text-6xl font-headline">
            Find the Perfect Plan
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Start for free, then upgrade to unlock powerful features to accelerate your job search.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary ring-2 ring-primary' : ''}`}>
              {tier.popular && (
                  <div className="text-center py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg">Most Popular</div>
              )}
              <CardHeader className="flex-1">
                <CardTitle className="font-headline">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.priceAnnotation && <span className="text-muted-foreground">{tier.priceAnnotation}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
