"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Clock, CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface OverviewData {
  totalInquiries: number
  newInquiries: number
  inProgressInquiries: number
  completedInquiries: number
  totalTourists: number
  activeTourists: number
}

export function StaffOverview() {
  const [overview, setOverview] = useState<OverviewData>({
    totalInquiries: 0,
    newInquiries: 0,
    inProgressInquiries: 0,
    completedInquiries: 0,
    totalTourists: 0,
    activeTourists: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    try {
      setLoading(true)

      // Fetch total tourists (users with 'tourist' role)
      const { count: totalTourists } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'tourist')

      // Fetch active tourists (status = 'active')
      const { count: activeTourists } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'tourist')
        .eq('status', 'active')

      // Fetch inquiries data
      const { data: inquiries } = await supabase
        .from('inquiries')
        .select('status')

      const totalInquiries = inquiries?.length || 0
      const newInquiries = inquiries?.filter(i => i.status === 'new' || i.status === 'pending').length || 0
      const inProgressInquiries = inquiries?.filter(i => i.status === 'in_progress' || i.status === 'processing').length || 0
      const completedInquiries = inquiries?.filter(i => i.status === 'completed' || i.status === 'resolved').length || 0

      setOverview({
        totalInquiries,
        newInquiries,
        inProgressInquiries,
        completedInquiries,
        totalTourists: totalTourists || 0,
        activeTourists: activeTourists || 0
      })
    } catch (error) {
      console.error('Error fetching overview data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Inquiries",
      value: overview.totalInquiries,
      description: "All time inquiries",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "New Inquiries",
      value: overview.newInquiries,
      description: "Awaiting response",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "In Progress",
      value: overview.inProgressInquiries,
      description: "Currently handling",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Completed",
      value: overview.completedInquiries,
      description: "Successfully resolved",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, Staff Member!</CardTitle>
          <CardDescription>
            Here's an overview of tourist inquiries and activities that need your attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{overview.totalTourists} Total Tourists</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>{overview.activeTourists} Active Accounts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Actions</CardTitle>
          <CardDescription>Items that need immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overview.newInquiries > 0 ? (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">New Inquiries Pending</div>
                    <div className="text-sm text-muted-foreground">
                      {overview.newInquiries} inquiries need your response
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {overview.newInquiries}
                </Badge>
              </div>
            ) : null}
            
            {overview.inProgressInquiries > 0 ? (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">In Progress Inquiries</div>
                    <div className="text-sm text-muted-foreground">
                      Follow up on {overview.inProgressInquiries} ongoing conversations
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {overview.inProgressInquiries}
                </Badge>
              </div>
            ) : null}
            
            {overview.newInquiries === 0 && overview.inProgressInquiries === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p className="font-medium">All caught up!</p>
                <p className="text-sm">No pending actions at the moment.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}