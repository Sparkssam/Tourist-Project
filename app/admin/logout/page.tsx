import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { OfflineLogoutTool } from "@/components/admin/offline-logout-tool"

export default function LogoutPage() {
  return (
    <AdminDashboardLayout currentPage="settings">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Force Logout</h1>
          <p className="text-muted-foreground">
            Use this when normal logout doesn't work due to network issues
          </p>
        </div>
        <div className="flex justify-center">
          <OfflineLogoutTool />
        </div>
      </div>
    </AdminDashboardLayout>
  )
}