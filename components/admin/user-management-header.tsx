"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Search, Filter } from "lucide-react"
import Link from "next/link"

export function UserManagementHeader() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage staff and tourist accounts, roles, and permissions
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin/users/create" className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Add New User</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search users by name, email, or role..."
                className="pl-10"
              />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                All Users
              </Button>
              <Button variant="outline" size="sm">
                Active Only
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 flex flex-wrap gap-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              134 Tourists
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              8 Staff Members
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              3 Administrators
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              12 Inactive Users
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}