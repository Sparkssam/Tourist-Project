import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { SimpleUserCreationForm } from "@/components/admin/simple-user-creation-form"

export default function SimpleCreateUserPage() {
  return (
    <AdminDashboardLayout currentPage="users">
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create User (Simple Method)</h1>
          <p className="text-muted-foreground">
            Create a user with a custom password. This method is more reliable and lets you set the exact password.
          </p>
        </div>
        <SimpleUserCreationForm />
      </div>
    </AdminDashboardLayout>
  )
}
