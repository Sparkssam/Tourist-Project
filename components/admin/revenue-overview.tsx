"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react"

// Mock revenue data
const mockRevenueData = {
  totalRevenue: 125600,
  monthlyRevenue: 18500,
  yearlyRevenue: 98000,
  pendingPayments: 5,
  completedPayments: 89,
  averageBookingValue: 1410,
  topPaymentMethod: 'Pesapal',
  growthRate: 12.5
}

export function RevenueOverview() {
  const stats = [
    {
      title: "Total Revenue",
      value: `$${mockRevenueData.totalRevenue.toLocaleString()}`,
      description: "All time revenue",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Monthly Revenue",
      value: `$${mockRevenueData.monthlyRevenue.toLocaleString()}`,
      description: `+${mockRevenueData.growthRate}% from last month`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Completed Payments",
      value: mockRevenueData.completedPayments,
      description: `${mockRevenueData.pendingPayments} pending`,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Average Booking",
      value: `$${mockRevenueData.averageBookingValue}`,
      description: "Per customer value",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ]

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

      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Distribution</CardTitle>
          <CardDescription>
            Revenue breakdown by payment method this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Pesapal (Online Payment)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">$11,100</span>
                <Badge variant="secondary">60%</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Bank Transfer</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">$5,550</span>
                <Badge variant="secondary">30%</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Cash Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">$1,850</span>
                <Badge variant="secondary">10%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>
            Monthly revenue performance over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Showing monthly totals in USD
          </div>
          <div className="space-y-3">
            {[
              { month: 'May 2024', amount: 18500, growth: 12.5 },
              { month: 'Apr 2024', amount: 16200, growth: -2.3 },
              { month: 'Mar 2024', amount: 13800, growth: 8.1 },
              { month: 'Feb 2024', amount: 14500, growth: 15.2 },
              { month: 'Jan 2024', amount: 12000, growth: 5.5 },
            ].map((item) => (
              <div key={item.month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{item.month}</div>
                  <div className="text-sm text-muted-foreground">
                    ${item.amount.toLocaleString()}
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={item.growth > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {item.growth > 0 ? '+' : ''}{item.growth}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}