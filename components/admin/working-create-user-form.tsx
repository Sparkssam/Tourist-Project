"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2 } from "lucide-react"

interface WorkingUserForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'admin' | 'staff' | 'tourist'
}

export function WorkingCreateUserForm() {
  const [formData, setFormData] = useState<WorkingUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff'
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

      console.log('🚀 Working user creation started (no auth dependency)')
      const { supabase } = await import('@/lib/supabase/client')

      // Generate UUID for the profile
      const userId = crypto.randomUUID()
      
      console.log('📝 Creating profile directly (bypasses auth constraints)')

      // Create profile without auth dependency
      const profileData = {
        id: userId,
        email: formData.email.toLowerCase().trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        status: 'active' as const,
        has_auth_account: false, // This profile doesn't have auth account yet
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError)
        
        if (profileError.message.includes('foreign key constraint')) {
          throw new Error(`Database constraint error. Please run the database fix script first:

1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy and run the SQL from fix-database-constraints.sql
4. Then try creating users again

Technical error: ${profileError.message}`)
        }
        
        if (profileError.message.includes('duplicate') || profileError.code === '23505') {
          throw new Error('A user with this email already exists!')
        }
        
        throw new Error(`Database error: ${profileError.message}`)
      }

      console.log('✅ Profile created successfully!')

      setMessage(`✅ SUCCESS! User profile created successfully!

👤 Name: ${formData.firstName} ${formData.lastName}
📧 Email: ${formData.email}
🔐 Role: ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
🆔 ID: ${userId}
🔄 Status: Profile created (no auth account yet)

📋 What happens next:
• User profile is ready in the system
• User can register at /register using this email
• Admin can see this user in the user management table
• Once registered, they'll have full auth access`)
      
      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'staff'
      })

    } catch (err: any) {
      console.error('❌ Error creating user:', err)
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Working User Creation</span>
        </CardTitle>
        <CardDescription>
          Direct profile creation (no auth dependencies) - Should work immediately
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
            <AlertDescription className="text-red-800 whitespace-pre-line">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                Creating Profile...
              </>
            ) : (
              "Create User Profile"
            )}
          </Button>
        </form>

        {/* Instructions */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">💡 How this works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Creates user profile directly in database</li>
              <li>• No auth account dependency (bypasses foreign key issues)</li>
              <li>• User appears in admin dashboard immediately</li>
              <li>• User can register later to get auth access</li>
            </ul>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-orange-800">⚠️ If you get database errors:</h4>
            <ol className="text-sm text-orange-700 space-y-1">
              <li>1. Go to Supabase Dashboard → SQL Editor</li>
              <li>2. Copy content from `fix-database-constraints.sql`</li>
              <li>3. Run the SQL script</li>
              <li>4. Try creating users again</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}