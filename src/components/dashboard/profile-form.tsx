
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
import { updateProfile, updatePassword, GoogleAuthProvider, reauthenticateWithPopup, deleteUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required.').max(50, 'Display name is too long.'),
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
  const [isDeleting, setIsDeleting] = useState(false);

  const isEmailProvider = user?.providerData.some(p => p.providerId === 'password');

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

  const getAvatarFallback = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }

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
      router.refresh();
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
        toast({ variant: 'destructive', title: 'Error updating password', description: 'For security, please log out and log back in to change your password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);

    try {
        // Re-authentication is required for security-sensitive operations.
        const provider = new GoogleAuthProvider(); // Or other providers
        await reauthenticateWithPopup(user, provider);

        // After successful re-authentication, delete the user.
        await deleteUser(user);

        toast({ title: 'Account Deleted', description: 'Your account has been permanently deleted.' });
        router.push('/');
    } catch (error: any) {
        console.error("Account deletion error:", error);
        let description = 'An error occurred. Please try again.';
        if (error.code === 'auth/requires-recent-login') {
            description = 'For your security, please log out and log back in before deleting your account.'
        } else if (error.code !== 'auth/user-cancelled' && error.code !== 'auth/popup-closed-by-user') {
            description = error.message;
        }
        toast({ variant: 'destructive', title: 'Deletion Failed', description });
    } finally {
        setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
        <div className='space-y-4'>
            <h3 className="text-lg font-medium">Avatar</h3>
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                    <AvatarFallback>{getAvatarFallback(user.email)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" disabled>Upload new photo</Button>
            </div>
        </div>

        <Separator/>

      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
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

      <Separator/>

      {isEmailProvider && (
        <>
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
            <Separator/>
        </>
      )}

       <div className="space-y-4">
          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Deleting your account is a permanent action and cannot be undone. This will delete all your resumes and personal data.
          </p>
           <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 animate-spin" /> : <Trash2 className="mr-2"/>}
                        Delete My Account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                        Yes, delete my account
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
      </div>

    </div>
  );
}

    