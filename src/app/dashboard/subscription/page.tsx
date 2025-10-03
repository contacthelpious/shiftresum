
import { SubscriptionManagement } from "@/components/dashboard/subscription-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SubscriptionPage() {
  return (
    <div className="container py-8 px-4 sm:px-8 max-w-2xl">
        <Card>
            <CardHeader>
                <CardTitle>Manage Subscription</CardTitle>
                <CardDescription>View your current plan and manage your subscription details.</CardDescription>
            </CardHeader>
            <CardContent>
                <SubscriptionManagement />
            </CardContent>
        </Card>
    </div>
  );
}
