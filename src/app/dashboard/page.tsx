'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Edit, PlusCircle, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

// Placeholder data for recent resumes
const recentResumes = [
  {
    id: "1",
    title: "Senior Developer Resume",
    lastEdited: "2 hours ago",
    previewUrl: "https://picsum.photos/seed/resume1/400/565",
  },
  {
    id: "2",
    title: "Product Manager Application",
    lastEdited: "Yesterday",
    previewUrl: "https://picsum.photos/seed/resume2/400/565",
  },
  {
    id: "3",
    title: "UX Designer Final",
    lastEdited: "3 days ago",
    previewUrl: "https://picsum.photos/seed/resume3/400/565",
  },
];


export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    if (isUserLoading) {
        return <div className="p-8">Loading...</div>
    }

    if (!user) {
        // This should be handled by middleware in a real app, but for now, a redirect will do.
        router.push('/login');
        return null;
    }

    const userName = user.displayName || user.email?.split('@')[0] || 'there';

  return (
    <div className="container py-8 px-4 sm:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">Here's your dashboard. Ready to land that next job?</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Resumes</CardTitle>
                    <CardDescription>Your saved resumes. Click one to start editing.</CardDescription>
                </div>
                <Button asChild>
                    <Link href="/builder">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Resume
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
              {recentResumes.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {recentResumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-medium text-muted-foreground">No resumes yet!</h3>
                    <p className="text-sm text-muted-foreground mt-1">Click the button below to create your first one.</p>
                    <Button asChild className="mt-4">
                        <Link href="/builder">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Resume
                        </Link>
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your profile and subscription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button variant="outline" className="w-full justify-start">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Manage Profile
                </Button>
                 <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Subscription
                </Button>
            </CardContent>
          </Card>

          <Card className="bg-accent text-accent-foreground">
             <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription className="text-accent-foreground/80">Unlock unlimited resumes, AI suggestions, and PDF downloads.</CardDescription>
             </CardHeader>
             <CardContent>
                <Button variant="secondary" asChild className="w-full">
                    <Link href="/pricing">View Plans</Link>
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
