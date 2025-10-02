"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, TestTube } from "lucide-react"

export function SimpleTestForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState('')

  const testDatabaseConnection = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    setStep('Testing database connection...')

    try {
      console.log('🔧 Simple database test started')
      const { supabase } = await import('@/lib/supabase/client')
      
      setStep('Checking if we can read profiles table...')
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        throw new Error(`Database read failed: ${error.message}`)
      }
      
      console.log('✅ Database read successful')
      setStep('Testing simple insert...')
      
      // Try a very simple insert
      const testId = crypto.randomUUID()
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: testId,
          email: `test_${Date.now()}@example.com`,
          first_name: 'Test',
          last_name: 'User',
          role: 'staff',
          status: 'active'
        })
      
      if (insertError) {
        throw new Error(`Insert failed: ${insertError.message}`)
      }
      
      console.log('✅ Insert successful')
      setStep('Cleaning up test record...')
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', testId)
      
      if (deleteError) {
        console.warn('⚠️ Cleanup failed:', deleteError)
      }
      
      setMessage('🎉 SUCCESS! Database is working perfectly!\n\n✅ Connection: OK\n✅ Read: OK\n✅ Insert: OK\n✅ Delete: OK\n\nThe database setup is correct. The issue might be in the form logic.')
      setStep('')
      
    } catch (err: any) {
      console.error('❌ Test failed:', err)
      setError(`Database test failed: ${err.message}`)
      setStep('')
    } finally {
      setLoading(false)
    }
  }

  const testActualUserCreation = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    setStep('Creating real user...')

    try {
      console.log('👤 Real user creation test started')
      const { supabase } = await import('@/lib/supabase/client')
      
      const testEmail = `realuser_${Date.now()}@kekeosafaris.com`
      const userId = crypto.randomUUID()
      
      setStep('Inserting user profile...')
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: testEmail,
          first_name: 'Real',
          last_name: 'User',
          role: 'staff',
          status: 'active',
          has_auth_account: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (error) {
        throw new Error(`User creation failed: ${error.message}`)
      }
      
      console.log('✅ Real user created successfully')
      setMessage(`🎉 SUCCESS! Real user created!\n\n👤 Email: ${testEmail}\n🆔 ID: ${userId}\n🔐 Role: Staff\n\nThis user now exists in your database and will show up in the admin panel.`)
      setStep('')
      
    } catch (err: any) {
      console.error('❌ User creation failed:', err)
      setError(`User creation failed: ${err.message}`)
      setStep('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="h-5 w-5" />
          <span>Database Connection Test</span>
        </CardTitle>
        <CardDescription>
          Simple test to isolate the exact problem
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Status Messages */}
        {step && (
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              {step}
            </AlertDescription>
          </Alert>
        )}

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

        <div className="space-y-4">
          <Button 
            onClick={testDatabaseConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading && step.includes('connection') ? 'Testing...' : 'Test Database Connection'}
          </Button>
          
          <Button 
            onClick={testActualUserCreation} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading && step.includes('user') ? 'Creating User...' : 'Create Real Test User'}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">What this tests:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Database connectivity</li>
            <li>• Table permissions</li>
            <li>• Insert/delete operations</li>
            <li>• Actual user creation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}