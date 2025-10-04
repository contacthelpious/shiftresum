
'use client';
import { SignupForm } from '@/components/auth/signup-form';
import { useUser } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Save the intended URL to session storage if it exists
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      sessionStorage.setItem('loginRedirect', redirectUrl);
    }

    // Redirect if user is already logged in and loading is complete
    if (!isUserLoading && user) {
       const storedRedirect = sessionStorage.getItem('loginRedirect');
      if (storedRedirect) {
        sessionStorage.removeItem('loginRedirect');
        router.push(storedRedirect);
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isUserLoading, router, searchParams]);

  const handleSuccess = () => {
    const redirectUrl = sessionStorage.getItem('loginRedirect');
    if (redirectUrl) {
      sessionStorage.removeItem('loginRedirect');
      router.push(redirectUrl);
    } else {
      router.push('/dashboard');
    }
  };

  return <SignupForm onSuccess={handleSuccess} />;
}
