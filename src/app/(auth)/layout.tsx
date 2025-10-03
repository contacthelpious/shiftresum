import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
