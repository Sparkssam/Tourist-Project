import { StaffDashboardLayout } from "@/components/staff/staff-dashboard-layout"
import { StaffOverview } from "@/components/staff/staff-overview"
import { TouristInquiriesList } from "@/components/staff/tourist-inquiries-list"

export default function StaffDashboardPage() {
  return (
    <StaffDashboardLayout currentPage="overview">
      <div className="space-y-6">
        <StaffOverview />
        <TouristInquiriesList />
      </div>
    </StaffDashboardLayout>
  )
}