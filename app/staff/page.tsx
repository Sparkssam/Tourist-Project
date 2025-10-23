import { StaffDashboardLayout } from "@/components/staff/staff-dashboard-layout"
import { StaffOverview } from "@/components/staff/staff-overview"

export default function StaffDashboardPage() {
  return (
    <StaffDashboardLayout currentPage="overview">
      <div className="space-y-6">
        <StaffOverview />
      </div>
    </StaffDashboardLayout>
  )
}