import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { FixedOfflineManagementTool } from "@/components/admin/fixed-offline-management-tool"

export default function SyncUsersPage() {
  return (
    <AdminDashboardLayout currentPage="users">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Offline User Management</h1>
          <p className="text-muted-foreground">
            Manage users created while offline and sync them manually when connection is restored
          </p>
        </div>
        <FixedOfflineManagementTool />
      </div>
    </AdminDashboardLayout>
  )
}