"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Activity, CheckCircle2, XCircle, Clock, AlertTriangle, Trash2 } from "lucide-react"

interface ActionLog {
  id: string
  timestamp: Date
  action: string
  status: 'loading' | 'success' | 'error' | 'info'
  details: string
  duration?: number
  response?: any
}

export function ProgressMonitor() {
  const [logs, setLogs] = useState<ActionLog[]>([])
  const [isRecording, setIsRecording] = useState(true)

  // Function to add a new log entry
  const addLog = (action: string, status: ActionLog['status'], details: string, response?: any, duration?: number) => {
    const newLog: ActionLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      status,
      details,
      duration,
      response
    }
    
    setLogs(prev => [newLog, ...prev.slice(0, 49)]) // Keep last 50 logs
  }

  // Global logging function that can be called from anywhere
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Make logging function available globally
      (window as any).logProgress = addLog
      
      // Override console methods to capture API calls
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        const startTime = Date.now()
        const url = args[0] instanceof Request ? args[0].url : args[0]
        
        addLog('API Request', 'loading', `Fetching: ${url}`)
        
        try {
          const response = await originalFetch(...args)
          const duration = Date.now() - startTime
          
          if (response.ok) {
            addLog('API Response', 'success', `✅ ${response.status} ${response.statusText}`, 
              { status: response.status, url }, duration)
          } else {
            addLog('API Response', 'error', `❌ ${response.status} ${response.statusText}`, 
              { status: response.status, url }, duration)
          }
          
          return response
        } catch (error) {
          const duration = Date.now() - startTime
          addLog('API Error', 'error', `🔥 Network error: ${error}`, { error: String(error) }, duration)
          throw error
        }
      }
      
      // Log page loads
      addLog('Page Load', 'info', `Progress Monitor initialized at ${new Date().toLocaleTimeString()}`)
      
      return () => {
        window.fetch = originalFetch
      }
    }
  }, [])

  const getStatusIcon = (status: ActionLog['status']) => {
    switch (status) {
      case 'loading': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'info': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: ActionLog['status']) => {
    const colors = {
      loading: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-orange-100 text-orange-800'
    }
    return (
      <Badge className={colors[status]}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const clearLogs = () => {
    setLogs([])
    addLog('System', 'info', 'Progress logs cleared')
  }

  const testButtons = [
    {
      label: 'Test Database Connection',
      action: () => {
        addLog('Database Test', 'loading', 'Testing database connection...')
        setTimeout(() => {
          addLog('Database Test', 'success', 'Database connection successful', { ping: '45ms' }, 1200)
        }, 1200)
      }
    },
    {
      label: 'Test User Creation',
      action: () => {
        addLog('User Creation', 'loading', 'Creating test user...')
        setTimeout(() => {
          addLog('User Creation', 'success', 'User created successfully', { userId: 'usr_123456' }, 2300)
        }, 2300)
      }
    },
    {
      label: 'Test Authentication',
      action: () => {
        addLog('Authentication', 'loading', 'Verifying user credentials...')
        setTimeout(() => {
          addLog('Authentication', 'success', 'Authentication successful', { token: 'jwt_abcdef' }, 800)
        }, 800)
      }
    },
    {
      label: 'Simulate Error',
      action: () => {
        addLog('Error Test', 'loading', 'Attempting operation that will fail...')
        setTimeout(() => {
          addLog('Error Test', 'error', 'Operation failed: Invalid credentials', { errorCode: 401 }, 500)
        }, 500)
      }
    }
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Progress Monitor</span>
            <Badge variant="outline" className={isRecording ? 'text-green-600' : 'text-gray-600'}>
              {isRecording ? '🔴 Recording' : '⏸️ Paused'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Real-time tracking of button clicks, API calls, and system responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Logs ({logs.length})
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {testButtons.map((button) => (
              <Button
                key={button.label}
                variant="outline"
                size="sm"
                onClick={button.action}
                className="text-xs"
              >
                {button.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Chronological list of all actions and their responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No activity recorded yet</p>
                <p className="text-sm">Press any button to start logging</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div key={log.id}>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(log.status)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{log.action}</h4>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {log.duration && (
                              <span className="text-xs text-muted-foreground">
                                {log.duration}ms
                              </span>
                            )}
                            {getStatusBadge(log.status)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{log.details}</p>
                        {log.response && (
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.response, null, 2)}
                          </pre>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {index < logs.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}