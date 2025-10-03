import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { FixedOfflineUserCreationForm } from "@/components/admin/fixed-offline-user-creation-form"

export default function CreateUserPage() {
  return (
    <AdminDashboardLayout currentPage="users">
      <div className="max-w-3xl mx-auto py-8">
        <FixedOfflineUserCreationForm />
      </div>
    </AdminDashboardLayout>
  )
}