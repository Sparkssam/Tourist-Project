"use client"

import { useState } from "react"
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
  RefreshCw
} from "lucide-react"
import { PaymentRecord } from "@/lib/types/user"

// Mock payment data
const mockPayments: PaymentRecord[] = [
  {
    id: "pay_001",
    userId: "user_101",
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com"
    },
    tourId: "tour_serengeti_001",
    tourName: "5-Day Serengeti Safari",
    amount: 2500,
    currency: "USD",
    paymentMethod: "pesapal",
    status: "completed",
    transactionId: "TXN_ABC123",
    createdAt: new Date("2024-09-28"),
    completedAt: new Date("2024-09-28"),
    description: "Full payment for Serengeti Safari package"
  },
  {
    id: "pay_002",
    userId: "user_102",
    user: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@email.com"
    },
    tourId: "tour_kilimanjaro_001",
    tourName: "7-Day Kilimanjaro Trek",
    amount: 1800,
    currency: "USD",
    paymentMethod: "bank_transfer",
    status: "pending",
    createdAt: new Date("2024-09-30"),
    description: "Deposit payment for Kilimanjaro trek"
  },
  {
    id: "pay_003",
    userId: "user_103",
    user: {
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike.wilson@email.com"
    },
    tourId: "tour_cultural_001",
    tourName: "3-Day Cultural Village Tour",
    amount: 800,
    currency: "USD",
    paymentMethod: "pesapal",
    status: "completed",
    transactionId: "TXN_DEF456",
    createdAt: new Date("2024-09-25"),
    completedAt: new Date("2024-09-25"),
    description: "Full payment for cultural tour"
  },
  {
    id: "pay_004",
    userId: "user_104",
    user: {
      firstName: "Emma",
      lastName: "Davis",
      email: "emma.davis@email.com"
    },
    tourId: "tour_ngorongoro_001",
    tourName: "4-Day Ngorongoro Crater Safari",
    amount: 1950,
    currency: "USD",
    paymentMethod: "cash",
    status: "completed",
    createdAt: new Date("2024-09-20"),
    completedAt: new Date("2024-09-22"),
    description: "Cash payment at office"
  },
  {
    id: "pay_005",
    userId: "user_105",
    user: {
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@email.com"
    },
    tourId: "tour_zanzibar_001",
    tourName: "5-Day Zanzibar Beach & Culture",
    amount: 1200,
    currency: "USD",
    paymentMethod: "pesapal",
    status: "failed",
    createdAt: new Date("2024-09-18"),
    description: "Payment failed - insufficient funds"
  }
]

export function PaymentsList() {
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadgeVariant = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'completed':
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

  const getPaymentMethodBadge = (method: PaymentRecord['paymentMethod']) => {
    const colors = {
      pesapal: "bg-blue-100 text-blue-800",
      bank_transfer: "bg-purple-100 text-purple-800",
      cash: "bg-green-100 text-green-800",
      other: "bg-gray-100 text-gray-800"
    }
    return colors[method] || colors.other
  }

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesSearch = searchTerm === '' || 
      payment.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tourName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const totalAmount = filteredPayments.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0
  )

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
            <Button variant="outline" size="sm">
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
              {filteredPayments.filter(p => p.status === 'completed').length} Completed
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
                            {payment.user.firstName} {payment.user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-sm">
                          {payment.tourName || 'N/A'}
                        </div>
                        {payment.description && (
                          <div className="text-xs text-muted-foreground">
                            {payment.description}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          ${payment.amount.toLocaleString()} {payment.currency}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={getPaymentMethodBadge(payment.paymentMethod)}>
                          {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={getStatusBadgeVariant(payment.status)}>
                          {payment.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {payment.createdAt.toLocaleDateString()}
                        </div>
                        {payment.completedAt && (
                          <div className="text-xs text-muted-foreground">
                            Completed: {payment.completedAt.toLocaleDateString()}
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
                            {payment.status === 'completed' && (
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