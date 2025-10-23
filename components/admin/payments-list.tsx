"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  DollarSign, 
  Calendar, 
  User, 
  Filter,
  Search,
  MoreHorizontal,
  Download,
  Eye,
  RefreshCw,
  Loader2
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Payment {
  id: string
  user_id: string
  tour_id?: string
  tour_name?: string
  amount: number
  currency: string
  payment_method: string
  status: string
  transaction_id?: string
  description?: string
  created_at: string
  completed_at?: string
  profiles?: {
    first_name: string
    last_name: string
    email: string
  }
}

export function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching payments:', error)
        return
      }

      setPayments(data || [])
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return "bg-green-100 text-green-800"
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      case 'failed':
        return "bg-red-100 text-red-800"
      case 'refunded':
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodLower = method?.toLowerCase() || ''
    if (methodLower.includes('pesapal')) return "bg-blue-100 text-blue-800"
    if (methodLower.includes('bank') || methodLower.includes('transfer')) return "bg-purple-100 text-purple-800"
    if (methodLower.includes('cash')) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status?.toLowerCase() === statusFilter.toLowerCase()
    const firstName = payment.profiles?.first_name || ''
    const lastName = payment.profiles?.last_name || ''
    const email = payment.profiles?.email || ''
    const tourName = payment.tour_name || ''
    
    const matchesSearch = searchTerm === '' || 
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourName.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const totalAmount = filteredPayments.reduce((sum, payment) => 
    payment.status?.toLowerCase() === 'completed' ? sum + (payment.amount || 0) : sum, 0
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading payments...</p>
        </CardContent>
      </Card>
    )
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>All Payments</span>
          </CardTitle>
          <CardDescription>
            Complete payment history and transaction details
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Payments Yet</h3>
          <p className="text-sm text-muted-foreground">
            Payment records will appear here once transactions are processed.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>All Payments</span>
            </CardTitle>
            <CardDescription>
              Complete payment history and transaction details
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={fetchPayments}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search payments by customer or tour..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">
                Showing {filteredPayments.length} payments
              </div>
              <div className="text-sm text-muted-foreground">
                Total completed: ${totalAmount.toLocaleString()}
              </div>
            </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {filteredPayments.filter(p => p.status?.toLowerCase() === 'completed').length} Completed
              </Badge>
          </div>

          {/* Payments Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Customer</th>
                    <th className="text-left p-4 font-medium text-sm">Tour</th>
                    <th className="text-left p-4 font-medium text-sm">Amount</th>
                    <th className="text-left p-4 font-medium text-sm">Payment Method</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm">Date</th>
                    <th className="text-left p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="font-medium">
                            {payment.profiles?.first_name || 'N/A'} {payment.profiles?.last_name || ''}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.profiles?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-sm">
                          {payment.tour_name || 'N/A'}
                        </div>
                        {payment.description && (
                          <div className="text-xs text-muted-foreground">
                            {payment.description}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          ${(payment.amount || 0).toLocaleString()} {payment.currency || 'USD'}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={getPaymentMethodBadge(payment.payment_method)}>
                          {(payment.payment_method || 'OTHER').replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={getStatusBadgeVariant(payment.status)}>
                          {(payment.status || 'UNKNOWN').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                        {payment.completed_at && (
                          <div className="text-xs text-muted-foreground">
                            Completed: {new Date(payment.completed_at).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                            {payment.status?.toLowerCase() === 'completed' && (
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Process Refund
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}