"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2, Copy, Check } from "lucide-react"

interface AdminUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
  adminSecret: string
}

export function ProperUserCreationForm() {
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
  const [createdUser, setCreatedUser] = useState<any>(null)
  const [passwordCopied, setPasswordCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setCreatedUser(null)

    try {
      // Basic validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      if (!formData.adminSecret) {
        throw new Error('Admin secret is required')
      }

      console.log('🔄 Creating user via API...')

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      console.log('✅ User created successfully:', data)

      setCreatedUser(data.user)
      
      const roleInfo = {
        admin: { icon: '👑', description: 'Full system access' },
        staff: { icon: '👨‍💼', description: 'Staff access' },
        tourist: { icon: '🧳', description: 'Tourist access' }
      }

      const role = roleInfo[formData.role]
      
      setMessage(`🎉 SUCCESS! User created with full authentication!

👤 **User Details:**
   • Name: ${formData.firstName} ${formData.lastName}
   • Email: ${formData.email}
   • Role: ${role.icon} ${formData.role}
   • ID: ${data.user.id}

${data.user.tempPassword ? `🔑 **Temporary Password:** ${data.user.tempPassword}
   ⚠️ IMPORTANT: Save this password - you won't see it again!
   User should change this password after first login.` : ''}

✅ **Status: User created in both Auth and Database**
   • User can login immediately at /login
   • Profile is synced with authentication`)

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'staff',
        adminSecret: formData.adminSecret // Keep the secret
      })

    } catch (err: any) {
      console.error('❌ Error creating user:', err)
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const copyPassword = () => {
    if (createdUser?.tempPassword) {
      navigator.clipboard.writeText(createdUser.tempPassword)
      setPasswordCopied(true)
      setTimeout(() => setPasswordCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Before you start:</strong><br/>
          1. Make sure your <code>.env.local</code> file has the correct <code>SUPABASE_SERVICE_ROLE_KEY</code><br/>
          2. Get it from: Supabase Dashboard → Settings → API → service_role key<br/>
          3. Restart your development server after updating the key
        </AlertDescription>
      </Alert>

      {/* User Creation Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Create User with Authentication</span>
          </CardTitle>
          <CardDescription>
            Creates a complete user with Supabase Auth + Profile - can login immediately
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

          {createdUser?.tempPassword && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Temporary Password:</strong> <code className="bg-white px-2 py-1 rounded">{createdUser.tempPassword}</code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyPassword}
                    className="ml-2"
                  >
                    {passwordCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 whitespace-pre-line">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  disabled={loading}
                  required
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
                placeholder="Enter email address"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number (optional)"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">User Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'admin' | 'staff' | 'tourist' }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourist">🧳 Tourist</SelectItem>
                  <SelectItem value="staff">👨‍💼 Staff</SelectItem>
                  <SelectItem value="admin">👑 Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminSecret">Admin Secret Key *</Label>
              <Input
                id="adminSecret"
                type="password"
                value={formData.adminSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, adminSecret: e.target.value }))}
                placeholder="Enter admin secret (from .env.local)"
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground">
                This is the SUPER_ADMIN_SECRET from your .env.local file
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating User with Auth...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
