
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser, useAuth } from '@/firebase';
import { updateProfile, updatePassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required.'),
});

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export function ProfileForm() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      displayName: user?.displayName || '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  if (isUserLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile(user, { displayName: values.displayName });
      toast({ title: 'Success', description: 'Your profile has been updated.' });
      router.refresh(); // This will re-fetch server components and update the UI
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    if (!user) return;
    setIsUpdatingPassword(true);
    try {
      await updatePassword(user, values.newPassword);
      toast({ title: 'Success', description: 'Your password has been changed.' });
      passwordForm.reset();
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error updating password', description: 'Please log out and log back in to change your password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <FormField
            control={profileForm.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={user.email || ''} disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdatingProfile}>
            {isUpdatingProfile && <Loader2 className="mr-2 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>

      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
           <h3 className="text-lg font-medium">Change Password</h3>
          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="secondary" disabled={isUpdatingPassword}>
            {isUpdatingPassword && <Loader2 className="mr-2 animate-spin" />}
            Change Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
