"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Zap, Clock } from "lucide-react"

export function QuickDiagnosticForm() {
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

  const testWithTimeout = async (testName: string, testFn: () => Promise<any>, timeoutMs = 3000) => {
    const startTime = Date.now()
    addResult(`🔄 Starting ${testName}...`)
    
    try {
      const result = await Promise.race([
        testFn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`${testName} timeout (${timeoutMs}ms)`)), timeoutMs)
        )
      ])
      
      const duration = Date.now() - startTime
      addResult(`✅ ${testName} completed in ${duration}ms`)
      return result
      
    } catch (err: any) {
      const duration = Date.now() - startTime
      addResult(`❌ ${testName} failed after ${duration}ms: ${err.message}`)
      throw err
    }
  }

  const runQuickDiagnostics = async () => {
    setLoading(true)
    clearResults()
    
    try {
      // Test 1: Basic import (should be instant)
      await testWithTimeout("Import Supabase client", async () => {
        const { supabase } = await import('@/lib/supabase/client')
        return supabase
      }, 1000)

      // Test 2: Create client (should be instant)
      let supabase: any
      await testWithTimeout("Initialize Supabase", async () => {
        const { supabase: client } = await import('@/lib/supabase/client')
        supabase = client
        return client
      }, 1000)

      // Test 3: Simple query with short timeout
      await testWithTimeout("Database ping (3s timeout)", async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true })
        
        if (error) throw error
        return data
      }, 3000)

      // Test 4: Very simple insert
      await testWithTimeout("Simple insert test", async () => {
        const testId = crypto.randomUUID()
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: testId,
            email: `quicktest_${Date.now()}@test.com`,
            first_name: 'Quick',
            last_name: 'Test',
            role: 'staff',
            status: 'active'
          })
        
        if (error) throw error
        
        // Clean up immediately
        await supabase.from('profiles').delete().eq('id', testId)
        return true
      }, 5000)

      addResult("🎉 ALL TESTS PASSED! Database is working correctly.")
      
    } catch (err: any) {
      setError(`Diagnostic failed: ${err.message}`)
      addResult(`💥 Diagnostic stopped at error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testJustConnection = async () => {
    setLoading(true)
    clearResults()
    
    try {
      addResult("🔌 Testing just the connection...")
      
      // Ultra simple test
      const { supabase } = await import('@/lib/supabase/client')
      addResult("✅ Supabase client imported")
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      
      addResult("🌐 Making request to Supabase...")
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=count`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          'Prefer': 'count=exact'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      addResult(`✅ Connection successful! Status: ${response.status}`)
      addResult("🎉 Your Supabase connection is working!")
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("Connection timeout after 2 seconds - network or Supabase issue")
        addResult("⏱️ Request timed out - this suggests network problems")
      } else {
        setError(`Connection test failed: ${err.message}`)
        addResult(`❌ Connection failed: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Quick Network Diagnostics</span>
        </CardTitle>
        <CardDescription>
          Fast timeout tests to identify connection issues
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

        <div className="space-y-4">
          <Button 
            onClick={testJustConnection} 
            disabled={loading}
            className="w-full"
          >
            <Clock className="mr-2 h-4 w-4" />
            {loading ? 'Testing Connection...' : 'Test Connection (2s timeout)'}
          </Button>
          
          <Button 
            onClick={runQuickDiagnostics} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            <Zap className="mr-2 h-4 w-4" />
            {loading ? 'Running Diagnostics...' : 'Full Diagnostic Suite'}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            <div className="text-sm space-y-1 font-mono">
              {results.map((result, i) => (
                <div key={i} className={`${result.includes('❌') ? 'text-red-600' : result.includes('✅') ? 'text-green-600' : 'text-gray-600'}`}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-yellow-800">💡 What timeouts mean:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>2s timeout</strong> = Network/internet issue</li>
            <li>• <strong>Works but slow</strong> = Supabase performance issue</li>
            <li>• <strong>Permission error</strong> = Database setup issue</li>
            <li>• <strong>All pass</strong> = Problem is in user creation logic</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}