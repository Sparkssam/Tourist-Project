"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, CreditCard, Users, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface RevenueData {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  pendingPayments: number
  completedPayments: number
  averageBookingValue: number
  growthRate: number
}

export function RevenueOverview() {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    averageBookingValue: 0,
    growthRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      setLoading(true)

      // Fetch all payments
      const { data: payments, error } = await supabase
        .from('payments')
        .select('amount, status, created_at')

      if (error) {
        console.error('Error fetching payments:', error)
        return
      }

      if (!payments || payments.length === 0) {
        setRevenueData({
          totalRevenue: 0,
          monthlyRevenue: 0,
          yearlyRevenue: 0,
          pendingPayments: 0,
          completedPayments: 0,
          averageBookingValue: 0,
          growthRate: 0
        })
        return
      }

      // Calculate total revenue (completed payments only)
      const completedPayments = payments.filter(p => p.status === 'completed')
      const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

      // Calculate monthly revenue (current month)
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const monthlyPayments = completedPayments.filter(p => {
        const paymentDate = new Date(p.created_at)
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
      })
      const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

      // Calculate yearly revenue (current year)
      const yearlyPayments = completedPayments.filter(p => {
        const paymentDate = new Date(p.created_at)
        return paymentDate.getFullYear() === currentYear
      })
      const yearlyRevenue = yearlyPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

      // Calculate previous month revenue for growth rate
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const lastMonthPayments = completedPayments.filter(p => {
        const paymentDate = new Date(p.created_at)
        return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear
      })
      const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
      
      const growthRate = lastMonthRevenue > 0 
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0

      // Count payment statuses
      const pendingCount = payments.filter(p => p.status === 'pending').length
      const completedCount = completedPayments.length

      // Calculate average booking value
      const averageBookingValue = completedCount > 0 ? totalRevenue / completedCount : 0

      setRevenueData({
        totalRevenue,
        monthlyRevenue,
        yearlyRevenue,
        pendingPayments: pendingCount,
        completedPayments: completedCount,
        averageBookingValue,
        growthRate
      })
    } catch (error) {
      console.error('Error calculating revenue:', error)
    } finally {
      setLoading(false)
    }
  }
  const stats = [
    {
      title: "Total Revenue",
      value: `$${revenueData.totalRevenue.toLocaleString()}`,
      description: "All time revenue",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Monthly Revenue",
      value: `$${revenueData.monthlyRevenue.toLocaleString()}`,
      description: revenueData.growthRate !== 0 
        ? `${revenueData.growthRate > 0 ? '+' : ''}${revenueData.growthRate.toFixed(1)}% from last month`
        : "No previous month data",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Completed Payments",
      value: revenueData.completedPayments,
      description: `${revenueData.pendingPayments} pending`,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Average Booking",
      value: `$${revenueData.averageBookingValue.toFixed(0)}`,
      description: "Per customer value",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading revenue data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Revenue Statistics */}
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

      {revenueData.totalRevenue === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Payment Data Yet</h3>
            <p className="text-sm text-muted-foreground">
              Revenue statistics will appear here once payments are recorded in the system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}