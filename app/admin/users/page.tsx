import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { UserManagementHeader } from "@/components/admin/user-management-header"

export default function UserManagementPage() {
  return (
    <AdminDashboardLayout currentPage="users">
      <div className="space-y-6">
        <UserManagementHeader />
        <UserManagementTable />
      </div>
    </AdminDashboardLayout>
  )
}