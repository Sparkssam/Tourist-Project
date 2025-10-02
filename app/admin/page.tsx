import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { QuickActions } from "@/components/admin/quick-actions"
import { UserManagementDashboard } from "@/components/admin/user-management-dashboard"

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout currentPage="overview">
      <div className="space-y-6">
        {/* Dashboard Statistics */}
        <DashboardStats />
        
        {/* User Management Overview */}
        <UserManagementDashboard />
        
        {/* Quick Actions */}
        <QuickActions />
        
        {/* Charts and Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RevenueChart />
          <RecentActivity />
        </div>
      </div>
    </AdminDashboardLayout>
  )
}