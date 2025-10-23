"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BarChart3 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface RevenueData {
  currentMonth: number
  lastMonth: number
  growth: number
  monthlyData: Array<{ month: string; revenue: number }>
  paymentMethods: Array<{ method: string; percentage: number; count: number }>
}

export function RevenueChart() {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    currentMonth: 0,
    lastMonth: 0,
    growth: 0,
    monthlyData: [],
    paymentMethods: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, created_at, status, payment_method')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (!payments) return

      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

      // Calculate current month payments
      const currentMonthPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at)
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
      })

      // Calculate current and last month revenue
      const currentMonthRevenue = currentMonthPayments
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

      const lastMonthRevenue = payments
        .filter(p => {
          const paymentDate = new Date(p.created_at)
          return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear
        })
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

      const growth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

      // Calculate payment method distribution for current month
      const methodCounts: Record<string, number> = {}
      currentMonthPayments.forEach(p => {
        const method = p.payment_method || 'other'
        methodCounts[method] = (methodCounts[method] || 0) + 1
      })

      const totalPayments = currentMonthPayments.length
      const paymentMethods = Object.entries(methodCounts).map(([method, count]) => ({
        method: method.replace('_', ' ').toUpperCase(),
        percentage: totalPayments > 0 ? Math.round((count / totalPayments) * 100) : 0,
        count
      })).sort((a, b) => b.percentage - a.percentage)

      // Generate last 6 months data
      const monthlyData: Array<{ month: string; revenue: number }> = []
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      for (let i = 5; i >= 0; i--) {
        const targetMonth = (currentMonth - i + 12) % 12
        const targetYear = currentMonth - i < 0 ? currentYear - 1 : currentYear
        
        const monthRevenue = payments
          .filter(p => {
            const paymentDate = new Date(p.created_at)
            return paymentDate.getMonth() === targetMonth && paymentDate.getFullYear() === targetYear
          })
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

        monthlyData.push({
          month: monthNames[targetMonth],
          revenue: monthRevenue
        })
      }

      setRevenueData({
        currentMonth: currentMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth: Math.round(growth * 10) / 10,
        monthlyData,
        paymentMethods
      })
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxRevenue = revenueData.monthlyData.length > 0 
    ? Math.max(...revenueData.monthlyData.map(d => d.revenue))
    : 1

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Revenue Overview</span>
        </CardTitle>
        <CardDescription>
          Monthly revenue trends and growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading revenue data...
          </div>
        ) : (
          <>
            {/* Revenue Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  ${revenueData.currentMonth.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">This Month</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-700">
                    {revenueData.growth >= 0 ? '+' : ''}{revenueData.growth}%
                  </span>
                </div>
                <div className="text-sm text-blue-600">Growth Rate</div>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">6-Month Trend</h4>
              {revenueData.monthlyData.map((data) => (
            <div key={data.month} className="flex items-center space-x-3">
              <div className="w-8 text-xs text-muted-foreground">
                {data.month}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                ></div>
              </div>
              <div className="w-16 text-xs text-right text-muted-foreground">
                ${data.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

            {/* Payment Methods Breakdown */}
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="font-medium text-sm mb-3">Payment Methods (This Month)</h4>
              {revenueData.paymentMethods.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {revenueData.paymentMethods.map((method) => (
                    <Badge 
                      key={method.method}
                      variant="secondary" 
                      className={
                        method.method.toLowerCase().includes('pesapal') ? "bg-blue-100 text-blue-800" :
                        method.method.toLowerCase().includes('bank') ? "bg-green-100 text-green-800" :
                        method.method.toLowerCase().includes('cash') ? "bg-orange-100 text-orange-800" :
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {method.method}: {method.percentage}% ({method.count})
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No payments this month</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}