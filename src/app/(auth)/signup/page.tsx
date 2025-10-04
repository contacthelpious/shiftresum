
'use client';
import { SignupForm } from '@/components/auth/signup-form';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is already logged in and loading is complete
    if (!isUserLoading && user) {
       const storedRedirect = sessionStorage.getItem('loginRedirect');
      if (storedRedirect) {
        router.push(storedRedirect);
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isUserLoading, router]);

  const handleSuccess = () => {
    const redirectUrl = sessionStorage.getItem('loginRedirect');
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/dashboard');
    }
  };

  return <SignupForm onSuccess={handleSuccess} />;
}
