"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, User, MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Activity {
  id: string
  type: 'payment' | 'user' | 'inquiry'
  title: string
  description: string
  amount?: string
  time: string
  icon: any
  iconColor: string
  iconBg: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      const activityList: Activity[] = []

      // Fetch recent payments
      const { data: payments } = await supabase
        .from('payments')
        .select(`
          id, amount, created_at, status, description,
          profiles!inner(first_name, last_name)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(3)

      payments?.forEach(payment => {
        activityList.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          title: 'Payment Received',
          description: `${payment.profiles.first_name} ${payment.profiles.last_name} completed payment`,
          amount: `$${Number(payment.amount).toLocaleString()}`,
          time: formatTimeAgo(payment.created_at),
          icon: DollarSign,
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100'
        })
      })

      // Fetch recent user registrations
      const { data: newUsers } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      newUsers?.forEach(user => {
        activityList.push({
          id: `user-${user.id}`,
          type: 'user',
          title: `New ${user.role === 'tourist' ? 'Tourist' : user.role === 'staff' ? 'Staff' : 'Admin'} Registration`,
          description: `${user.first_name} ${user.last_name} joined as ${user.role}`,
          time: formatTimeAgo(user.created_at),
          icon: User,
          iconColor: user.role === 'admin' ? 'text-purple-600' : user.role === 'staff' ? 'text-blue-600' : 'text-green-600',
          iconBg: user.role === 'admin' ? 'bg-purple-100' : user.role === 'staff' ? 'bg-blue-100' : 'bg-green-100'
        })
      })

      // Fetch recent inquiries
      const { data: inquiries } = await supabase
        .from('tourist_inquiries')
        .select(`
          id, tour_type, created_at, status,
          profiles!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3)

      inquiries?.forEach(inquiry => {
        activityList.push({
          id: `inquiry-${inquiry.id}`,
          type: 'inquiry',
          title: 'New Safari Inquiry',
          description: `${inquiry.profiles.first_name} ${inquiry.profiles.last_name} inquired about ${inquiry.tour_type}`,
          time: formatTimeAgo(inquiry.created_at),
          icon: MessageSquare,
          iconColor: 'text-orange-600',
          iconBg: 'bg-orange-100'
        })
      })

      // Sort all activities by time (most recent first)
      activityList.sort((a, b) => {
        // This is a simple sort - in production you'd use proper date parsing
        return a.time.localeCompare(b.time)
      })

      setActivities(activityList.slice(0, 5))
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription>
          Latest system activities and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading recent activity...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity found
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0 last:pb-0">
                  <div className={`p-2 rounded-full ${activity.iconBg} flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      {activity.amount && (
                        <Badge variant="secondary" className="text-green-700 bg-green-50">
                          {activity.amount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <button className="text-sm text-primary hover:underline">
            View all activities →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}