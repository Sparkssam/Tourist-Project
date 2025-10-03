"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, AlertTriangle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export function OfflineLogoutTool() {
  const router = useRouter()

  const forceLogout = () => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_session')
    localStorage.removeItem('supabase.auth.token')
    
    // Clear all cookies (best effort)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    })
    
    // Clear sessionStorage
    sessionStorage.clear()
    
    // Redirect to login page
    router.push('/login')
    
    // Force page reload to clear any remaining state
    setTimeout(() => {
      window.location.href = '/login'
    }, 100)
  }

  const refreshPage = () => {
    window.location.reload()
  }

  const clearCache = () => {
    // Clear browser cache (limited capability)
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    
    // Clear localStorage except offline users
    const offlineUsers = localStorage.getItem('offline_users')
    localStorage.clear()
    if (offlineUsers) {
      localStorage.setItem('offline_users', offlineUsers)
    }
    
    alert('Cache cleared! Page will refresh.')
    window.location.reload()
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LogOut className="h-5 w-5 text-red-600" />
          <span>Offline Logout Tool</span>
        </CardTitle>
        <CardDescription>
          Logout manually when network issues prevent normal logout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Network Issue:</strong> Normal logout is not working due to connectivity problems.
            Use the force logout option below.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button 
            onClick={forceLogout} 
            variant="destructive" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Force Logout (Recommended)
          </Button>
          
          <Button 
            onClick={refreshPage} 
            variant="outline" 
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>

          <Button 
            onClick={clearCache} 
            variant="ghost" 
            className="w-full"
          >
            Clear Cache & Logout
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>Force Logout</strong> will:</p>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>Clear all authentication data</li>
            <li>Remove session cookies</li>
            <li>Redirect to login page</li>
            <li>Preserve your offline users</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}