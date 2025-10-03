import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { ProperUserCreationForm } from "@/components/admin/proper-user-creation-form"

export default function ProperCreateUserPage() {
  return (
    <AdminDashboardLayout currentPage="users">
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create New User (With Authentication)</h1>
          <p className="text-muted-foreground">
            This creates a complete user account with both Supabase Authentication and Profile data.
            The user will be able to login immediately.
          </p>
        </div>
        <ProperUserCreationForm />
      </div>
    </AdminDashboardLayout>
  )
}
