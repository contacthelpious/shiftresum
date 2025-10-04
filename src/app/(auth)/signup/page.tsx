
'use client';
import { SignupForm } from '@/components/auth/signup-form';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in and loading is complete
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  return <SignupForm onSuccess={handleSuccess} />;
}
