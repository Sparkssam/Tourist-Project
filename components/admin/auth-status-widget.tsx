"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Users, MapPin, CheckCircle, AlertCircle, LogOut, User } from "lucide-react"
import Link from "next/link"

export function AuthStatusWidget() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRoleIcon = (role?: string) => {
    switch(role) {
      case 'admin': return <Shield className="h-4 w-4 text-purple-600" />
      case 'staff': return <Users className="h-4 w-4 text-blue-600" />
      case 'tourist': return <MapPin className="h-4 w-4 text-green-600" />
      default: return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadgeColor = (role?: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'staff': return 'bg-blue-100 text-blue-800'
      case 'tourist': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Authentication Status</span>
        </CardTitle>
        <CardDescription>
          Current user authentication and session information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Authenticated User</h3>
                <p className="text-sm text-muted-foreground">Currently logged in</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-lg">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : 'Not set'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Role</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getRoleIcon(profile?.role)}
                  <Badge className={getRoleBadgeColor(profile?.role)}>
                    {profile?.role || 'No role'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  {profile?.status || 'Active'}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Test Logout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Not Authenticated</h3>
                <p className="text-sm text-muted-foreground">Please log in to access admin features</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <div className="pt-4 border-t">
              <Button asChild className="w-full">
                <Link href="/login">Login to Admin</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}