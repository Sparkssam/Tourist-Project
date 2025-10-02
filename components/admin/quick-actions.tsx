"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, DollarSign, MessageSquare, Settings } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Add New User",
      description: "Create staff or admin accounts",
      icon: UserPlus,
      href: "/admin/users/create",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "View Revenue",
      description: "Check payments and earnings",
      icon: DollarSign,
      href: "/admin/revenue",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Manage Inquiries",
      description: "Review tourist requests",
      icon: MessageSquare,
      href: "/admin/inquiries",
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "System Settings",
      description: "Configure system options",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Frequently used administrative tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                asChild
                className={`h-auto p-4 flex-col space-y-2 ${action.color}`}
              >
                <Link href={action.href}>
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}