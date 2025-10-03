
import { ProfileForm } from "@/components/dashboard/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="container py-8 px-4 sm:px-8 max-w-2xl">
        <Card>
            <CardHeader>
                <CardTitle>Manage Profile</CardTitle>
                <CardDescription>Update your personal information and password here.</CardDescription>
            </CardHeader>
            <CardContent>
                <ProfileForm />
            </CardContent>
        </Card>
    </div>
  );
}
