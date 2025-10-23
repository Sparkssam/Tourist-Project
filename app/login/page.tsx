"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { loginAction } from "./actions"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Login attempt initiated')
      }
      
      // Use server action for login
      const result = await loginAction(formData.email, formData.password)

      if (!result.success) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Login failed:', result.statusCode)
        }
        setError(result.error || 'Login failed')
        setLoading(false)
        return
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Login successful')
      }
      
      // Use window.location for full page refresh to ensure cookies are properly set
      // This fixes the timing issue where middleware doesn't see the session yet
      if (result.role === 'admin') {
        window.location.href = '/admin'
      } else if (result.role === 'staff') {
        window.location.href = '/staff'
      } else if (result.role === 'tourist') {
        window.location.href = '/tourist'
      } else {
        window.location.href = '/dashboard'
      }
      
      // Don't set loading to false - let the page refresh happen
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error.message)
      }
      setError(error.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/50 to-primary/5 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>
            Sign in to your Kekeo Safaris member account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center space-y-2">
            <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
              Forgot your password?
            </Link>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}