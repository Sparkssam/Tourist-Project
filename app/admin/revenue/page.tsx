import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { RevenueOverview } from "@/components/admin/revenue-overview"
import { PaymentsList } from "@/components/admin/payments-list"

export default function RevenuePage() {
  return (
    <AdminDashboardLayout currentPage="revenue">
      <div className="space-y-6">
        <RevenueOverview />
        <PaymentsList />
      </div>
    </AdminDashboardLayout>
  )
}