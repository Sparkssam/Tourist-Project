"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react"

export function OfflineTestForm() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState('')

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearResults = () => {
    setResults([])
    setError('')
  }

  // Test 1: Pure JavaScript - no network
  const testOfflineCode = async () => {
    setLoading(true)
    clearResults()
    
    try {
      addResult("🧪 Testing pure JavaScript (no network)...")
      
      // Test basic crypto
      const testId = crypto.randomUUID()
      addResult(`✅ UUID generation works: ${testId.slice(0, 8)}...`)
      
      // Test date
      const now = new Date().toISOString()
      addResult(`✅ Date generation works: ${now}`)
      
      // Test form data simulation
      const mockFormData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'staff'
      }
      addResult(`✅ Form data simulation works: ${JSON.stringify(mockFormData)}`)
      
      // Test async/await
      await new Promise(resolve => setTimeout(resolve, 100))
      addResult("✅ Async/await works")
      
      addResult("🎉 All offline tests passed - JavaScript is working correctly")
      
    } catch (err: any) {
      setError(`Offline test failed: ${err.message}`)
      addResult(`❌ Offline test error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test 2: Environment variables - no network
  const testEnvironmentVars = async () => {
    setLoading(true)
    clearResults()
    
    try {
      addResult("🔧 Testing environment variables...")
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl) {
        throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing")
      }
      
      if (!supabaseKey) {
        throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing")
      }
      
      addResult(`✅ Supabase URL found: ${supabaseUrl.slice(0, 30)}...`)
      addResult(`✅ Supabase Key found: ${supabaseKey.slice(0, 30)}...`)
      
      // Test URL parsing
      const url = new URL(supabaseUrl)
      addResult(`✅ URL is valid: ${url.hostname}`)
      
      addResult("🎉 Environment variables are correct")
      
    } catch (err: any) {
      setError(`Environment test failed: ${err.message}`)
      addResult(`❌ Environment error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test 3: Import test - no network call
  const testImports = async () => {
    setLoading(true)
    clearResults()
    
    try {
      addResult("📦 Testing imports (no network calls)...")
      
      // Test import without using
      const startTime = Date.now()
      const supabaseModule = await import('@/lib/supabase/client')
      const importTime = Date.now() - startTime
      
      addResult(`✅ Supabase client import took ${importTime}ms`)
      
      // Test if client exists
      if (!supabaseModule.supabase) {
        throw new Error("Supabase client not exported correctly")
      }
      
      addResult("✅ Supabase client exists in module")
      
      // Don't actually call anything - just check it's there
      addResult("🎉 All imports working correctly")
      
    } catch (err: any) {
      setError(`Import test failed: ${err.message}`)
      addResult(`❌ Import error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test 4: Network connectivity test - minimal fetch
  const testNetworkOnly = async () => {
    setLoading(true)
    clearResults()
    
    try {
      addResult("🌐 Testing basic network connectivity...")
      
      // Test with 1-second timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        addResult("⏱️ Network test timed out after 1 second")
      }, 1000)
      
      const startTime = Date.now()
      
      // Just test if we can reach Supabase at all
      const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL!, {
        method: 'HEAD', // Minimal request
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const duration = Date.now() - startTime
      
      addResult(`✅ Network reached Supabase in ${duration}ms`)
      addResult(`✅ HTTP Status: ${response.status}`)
      
      if (duration > 500) {
        addResult("⚠️ Network is slow - this could be causing timeouts")
      }
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("Network timeout - your internet connection to Supabase is too slow")
        addResult("❌ Network is too slow or unreachable")
      } else {
        setError(`Network error: ${err.message}`)
        addResult(`❌ Network error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <WifiOff className="h-5 w-5" />
          <span>Step-by-Step Isolation Test</span>
        </CardTitle>
        <CardDescription>
          Test each component separately to find what's causing the hang
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            onClick={testOfflineCode} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? 'Testing...' : '1. Test Code (Offline)'}
          </Button>
          
          <Button 
            onClick={testEnvironmentVars} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? 'Testing...' : '2. Test Env Vars'}
          </Button>
          
          <Button 
            onClick={testImports} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? 'Testing...' : '3. Test Imports'}
          </Button>
          
          <Button 
            onClick={testNetworkOnly} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <Wifi className="mr-1 h-3 w-3" />
            {loading ? 'Testing...' : '4. Test Network'}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
            <h4 className="font-semibold mb-2">Live Test Results:</h4>
            <div className="text-sm space-y-1 font-mono">
              {results.map((result, i) => (
                <div key={i} className={`${result.includes('❌') ? 'text-red-600' : result.includes('✅') ? 'text-green-600' : result.includes('⚠️') ? 'text-orange-600' : 'text-gray-600'}`}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">🎯 Testing Strategy:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li><strong>1. Code Test</strong> - If this hangs, it's a JavaScript issue</li>
            <li><strong>2. Env Vars</strong> - If this hangs, environment loading issue</li>
            <li><strong>3. Imports</strong> - If this hangs, module loading issue</li>
            <li><strong>4. Network</strong> - If this hangs, internet/Supabase issue</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}