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
} from "@/components/ui/alert-dialog"
import { 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Home,
  Eye,
  Calendar,
  Loader2
} from "lucide-react"

interface StaffDashboardLayoutProps {
  children: React.ReactNode
  currentPage?: 'overview' | 'inquiries' | 'tourists' | 'profile'
}

export function StaffDashboardLayout({ children, currentPage = 'overview' }: StaffDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { signOut, profile } = useAuth()
  const router = useRouter()

  const navigationItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      href: '/staff',
      icon: Home,
      description: 'Overview and quick stats'
    },
    {
      id: 'inquiries',
      label: 'Tourist Inquiries',
      href: '/staff/inquiries',
      icon: MessageSquare,
      description: 'View and respond to inquiries'
    },
    {
      id: 'tourists',
      label: 'Tourist Details',
      href: '/staff/tourists',
      icon: Users,
      description: 'View registered tourists'
    },
    {
      id: 'profile',
      label: 'My Profile',
      href: '/staff/profile',
      icon: Settings,
      description: 'Update your profile'
    }
  ]

  const confirmLogout = async () => {
    setLoggingOut(true)
    setShowLogoutDialog(false)
    try {
      // Try normal logout with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Logout timeout')), 3000)
      )
      
      await Promise.race([signOut(), timeoutPromise])
      
      // If successful, redirect
      router.push('/login')
    } catch (error) {
      console.error('Logout failed or timed out, forcing local logout:', error)
      
      // Force logout locally if network logout fails
      if (typeof window !== 'undefined') {
        // Clear all auth storage
        localStorage.clear()
        sessionStorage.clear()
        
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
        })
        
        // Redirect to login
        window.location.href = '/login'
      }
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
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Eye className="h-6 w-6" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-lg">Staff Panel</h2>
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
            <Calendar className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Toggle Sidebar</span>}
          </Button>
          
          <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogoutDialog(true)}
              disabled={loggingOut}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {loggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {sidebarOpen && <span className="ml-2">Logging out...</span>}
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  {sidebarOpen && <span className="ml-2">Logout</span>}
                </>
              )}
            </Button>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out of your staff account?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmLogout}>
                  Logout
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
                {navigationItems.find(item => item.id === currentPage)?.label || 'Staff Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {navigationItems.find(item => item.id === currentPage)?.description || 'Manage tourist inquiries and information'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Staff Member
              </Badge>
              
              <div className="text-right">
                <div className="font-medium">Staff User</div>
                <div className="text-sm text-muted-foreground">staff@kekeosafaris.com</div>
              </div>
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