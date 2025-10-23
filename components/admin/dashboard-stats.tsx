"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, MessageSquare, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Stats {
  totalUsers: number
  activeUsers: number
  touristCount: number
  staffCount: number
  adminCount: number
  totalInquiries: number
  pendingInquiries: number
  totalRevenue: number
  monthlyRevenue: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    touristCount: 0,
    staffCount: 0,
    adminCount: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch user stats
      const { data: profiles } = await supabase.from('profiles').select('role, status')
      
      const totalUsers = profiles?.length || 0
      const activeUsers = profiles?.filter(p => p.status === 'active').length || 0
      const touristCount = profiles?.filter(p => p.role === 'tourist').length || 0
      const staffCount = profiles?.filter(p => p.role === 'staff').length || 0
      const adminCount = profiles?.filter(p => p.role === 'admin').length || 0

      // Fetch inquiry stats
      const { data: inquiries } = await supabase.from('inquiries').select('status')
      const totalInquiries = inquiries?.length || 0
      const pendingInquiries = inquiries?.filter(i => i.status === 'new' || i.status === 'in_progress').length || 0

      // Fetch revenue stats
      const { data: payments } = await supabase.from('payments').select('amount, created_at, status')
      const completedPayments = payments?.filter(p => p.status === 'completed') || []
      const totalRevenue = completedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
      
      // Calculate this month's revenue
      const now = new Date()
      const thisMonth = completedPayments.filter(p => {
        const paymentDate = new Date(p.created_at)
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
      })
      const monthlyRevenue = thisMonth.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

      setStats({
        totalUsers,
        activeUsers,
        touristCount,
        staffCount,
        adminCount,
        totalInquiries,
        pendingInquiries,
        totalRevenue,
        monthlyRevenue
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers,
      description: loading ? "Loading..." : `${stats.activeUsers} active users`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`,
      description: loading ? "Loading..." : `$${stats.monthlyRevenue.toLocaleString()} this month`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Tourist Inquiries",
      value: loading ? "..." : stats.totalInquiries,
      description: loading ? "Loading..." : `${stats.pendingInquiries} pending responses`,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Active Staff",
      value: loading ? "..." : stats.staffCount,
      description: loading ? "Loading..." : `${stats.adminCount} administrators`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
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
      
      {/* User Breakdown Card */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>User Breakdown</CardTitle>
          <CardDescription>Distribution of users by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {loading ? "..." : stats.touristCount} Tourists
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {loading ? "..." : stats.staffCount} Staff Members
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {loading ? "..." : stats.adminCount} Administrators
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}