import { AuthStatusWidget } from "@/components/admin/auth-status-widget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TestTube2, Zap, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AdminTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin System Test</h1>
          <p className="text-muted-foreground">
            Verify authentication status and test logout functionality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AuthStatusWidget />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube2 className="h-5 w-5 text-blue-600" />
                <span>Test Actions</span>
              </CardTitle>
              <CardDescription>
                Available test actions for debugging and verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Navigation Tests</h4>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin">Admin Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/users">User Management</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Login Page</Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Status Indicators</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span>Real-time auth state monitoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span>Logout redirect verification</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-orange-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>Verify your authentication status shows as "Authenticated User"</li>
              <li>Check that your role and profile information is displayed correctly</li>
              <li>Click "Test Logout" to verify the logout functionality works</li>
              <li>You should be redirected to the login page after logout</li>
              <li>Try accessing /admin again to confirm proper redirect protection</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}