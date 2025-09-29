import { AnalyticsCards } from '@/components/dashboard/admin/analytics-cards';
import { UserManagement } from '@/components/dashboard/admin/user-management';

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Analytics and management overview.</p>
      </div>
      <AnalyticsCards />
      <UserManagement />
    </div>
  );
}
