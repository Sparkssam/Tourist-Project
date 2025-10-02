'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SuperAdminRegister() {
  const [formData, setFormData] = useState({
    email: 'admin@kekeosafaris.com',
    password: '',
    confirmPassword: '',
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+255000000000',
    secretKey: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Using the imported supabase client

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Validate
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    if (formData.secretKey !== 'kekeo_safari_super_admin_2024_secret_key') {
      setError('Invalid super admin secret key')
      setLoading(false)
      return
    }

    try {
      // Check if admin already exists
      const { data: existingAdmins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)

      if (existingAdmins && existingAdmins.length > 0) {
        setError('Super admin already exists!')
        setLoading(false)
        return
      }

      // WORKAROUND: Create user with emailRedirectTo to avoid trigger issues
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'admin'
          }
        }
      })

      if (authError) {
        // If we still get database error, try a different approach
        if (authError.message.includes('Database error')) {
          setError('Database trigger issue detected. Please try one of these solutions:')
          setMessage(`
🔧 SOLUTION 1: Check Supabase Dashboard
1. Go to Authentication > Users
2. Check if user was partially created
3. Delete any duplicate users

🔧 SOLUTION 2: Disable the trigger temporarily
1. Go to Supabase SQL Editor
2. Run: DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
3. Try creating admin again
4. Then re-run the trigger SQL from supabase-schema.sql

🔧 SOLUTION 3: Use alternative email
Try a completely different email domain:
- Try Gmail, Outlook, or a custom domain
- Current email: ${formData.email}

💡 The issue is likely with the database trigger that auto-creates profiles.
          `)
          setLoading(false)
          return
        }
        throw authError
      }

      if (authData.user) {
        setMessage('⏳ Creating user profile...')
        
        // Wait a moment then manually create/update profile
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'admin',
            status: 'active'
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          setError(`Profile creation failed: ${profileError.message}`)
          setMessage(`User account created but profile setup failed.
                     User ID: ${authData.user.id}
                     You may need to manually add this user to the profiles table.`)
        } else {
          setMessage(`✅ Super admin created successfully! 
                     👤 ${formData.firstName} ${formData.lastName}
                     📧 ${formData.email}
                     🆔 ${authData.user.id}
                     
                     You can now login with these credentials at:
                     http://localhost:3000/login`)
        }
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">🦁 Kekeo Safaris</CardTitle>
          <CardDescription>Super Admin Registration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Secret Key</label>
              <Input
                type="password"
                value={formData.secretKey}
                onChange={(e) => setFormData(prev => ({ ...prev, secretKey: e.target.value }))}
                placeholder="Enter super admin secret key"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                minLength={8}
                required
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800 whitespace-pre-line">{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '⏳ Creating...' : '🔒 Create Super Admin'}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-semibold mb-1">💡 Secret Key:</p>
            <code className="text-xs bg-white px-2 py-1 rounded">
              kekeo_safari_super_admin_2024_secret_key
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}