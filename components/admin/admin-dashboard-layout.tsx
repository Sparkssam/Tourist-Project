"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  Home,
  MessageSquare,
  BarChart3,
  Shield,
  Loader2,
  Database,
  Activity
} from "lucide-react"

interface AdminDashboardLayoutProps {
  children: React.ReactNode
  currentPage?: 'overview' | 'users' | 'revenue' | 'inquiries' | 'settings' | 'database' | 'progress'
}

export function AdminDashboardLayout({ children, currentPage = 'overview' }: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { signOut, profile, user } = useAuth()
  const router = useRouter()

  const navigationItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      href: '/admin',
      icon: Home,
      description: 'System overview and statistics'
    },
    {
      id: 'users',
      label: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage staff and tourist accounts'
    },
    {
      id: 'revenue',
      label: 'Revenue & Payments',
      href: '/admin/revenue',
      icon: DollarSign,
      description: 'View all payments and revenue'
    },
    {
      id: 'inquiries',
      label: 'Tourist Inquiries',
      href: '/admin/inquiries',
      icon: MessageSquare,
      description: 'Monitor all tourist inquiries'
    },
    {
      id: 'database',
      label: 'Database Viewer',
      href: '/admin/database',
      icon: Database,
      description: 'View all database tables and data'
    },
    {
      id: 'progress',
      label: 'Progress Monitor',
      href: '/admin/progress',
      icon: Activity,
      description: 'Track API calls and system responses'
    },
    {
      id: 'settings',
      label: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'Configure system settings'
    }
  ]

  const confirmLogout = async () => {
    setLoggingOut(true)
    setShowLogoutDialog(false)
    try {
      await signOut()
      // Redirect to login page
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-sm text-muted-foreground">Kekeo Safaris</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                  }
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs opacity-70 truncate">{item.description}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-start"
          >
            <BarChart3 className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Toggle Sidebar</span>}
          </Button>
          
          <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={loggingOut}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {sidebarOpen && (
                  <span className="ml-2">
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout? You will be redirected to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmLogout}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    'Logout'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {navigationItems.find(item => item.id === currentPage)?.label || 'Admin Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {navigationItems.find(item => item.id === currentPage)?.description || 'Manage your safari business'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'User'}
              </Badge>
              
              <div className="text-right">
                <div className="font-medium">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}` 
                    : user?.email?.split('@')[0] || 'User'
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  {user?.email || 'user@kekeosafaris.com'}
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loggingOut}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {loggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout? You will be redirected to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={confirmLogout}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {loggingOut ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        'Logout'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}