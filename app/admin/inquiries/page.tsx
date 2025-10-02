import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminInquiriesPage() {
  return (
    <AdminDashboardLayout currentPage="inquiries">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tourist Inquiries</h1>
          <p className="text-muted-foreground">
            Manage and respond to tourist safari inquiries
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Inquiries Management</CardTitle>
            <CardDescription>View and manage tourist safari inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Inquiries management system will be implemented here.</p>
              <p className="text-sm mt-2">This page will show all tourist inquiries with status tracking and response capabilities.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}