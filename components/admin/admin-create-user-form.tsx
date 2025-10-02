"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2, Key } from "lucide-react"

interface AdminUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
  adminSecret: string
}

export function AdminCreateUserForm() {
  const [formData, setFormData] = useState<AdminUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff',
    adminSecret: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields')
      }

      if (!formData.adminSecret) {
        throw new Error('Admin secret is required for user creation')
      }

      console.log('🚀 Admin user creation started')

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role,
          adminSecret: formData.adminSecret
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user')
      }

      if (result.success) {
        console.log('✅ User created successfully via API')

        const user = result.user
        setMessage(`✅ SUCCESS! User account created successfully!

👤 Name: ${user.firstName} ${user.lastName}
📧 Email: ${user.email}
🔐 Role: ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
🆔 ID: ${user.id}
${user.tempPassword !== 'N/A (Profile only - no auth account)' ? `🔑 Temp Password: ${user.tempPassword}` : ''}

${user.note || 'The user can now login with their email and temporary password.'}`)
        
        // Reset form
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          role: 'staff',
          adminSecret: formData.adminSecret // Keep admin secret
        })
      }

    } catch (err: any) {
      console.error('❌ Error creating user:', err)
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  // Auto-fill admin secret if available in env
  const fillAdminSecret = () => {
    setFormData(prev => ({ ...prev, adminSecret: 'kekeo_safari_super_admin_2024_secret_key' }))
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Admin API User Creation</span>
        </CardTitle>
        <CardDescription>
          Server-side user creation with admin privileges (bypasses all auth limitations)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success/Error Messages */}
        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin Secret */}
          <div className="space-y-2">
            <Label htmlFor="adminSecret" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Admin Secret *</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                id="adminSecret"
                type="password"
                value={formData.adminSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, adminSecret: e.target.value }))}
                placeholder="Enter admin secret key..."
                required
                disabled={loading}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={fillAdminSecret}
                disabled={loading}
                size="sm"
              >
                Fill
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john.doe@kekeosafaris.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+255 123 456 789"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">User Role *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'admin' | 'staff' | 'tourist') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff Member</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="tourist">Tourist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating User Account...
              </>
            ) : (
              "Create User Account"
            )}
          </Button>
        </form>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Admin API Method:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Uses server-side API with admin privileges</li>
            <li>• Bypasses client-side auth limitations</li>
            <li>• Creates both auth account and profile</li>
            <li>• Includes fallback if service role unavailable</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}