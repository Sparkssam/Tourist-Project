"use client"

import { useState, useEffect } from "react"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  User,
  Calendar,
  MessageSquare
} from "lucide-react"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

interface DeletionRequest {
  id: string
  inquiry_id: string
  requested_by: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
  inquiry?: {
    name: string
    email: string
    subject: string
    message: string
    travel_dates?: string
    created_at: string
  }
  requester?: {
    email: string
  }
}

export default function AdminDeletionRequestsPage() {
  const [requests, setRequests] = useState<DeletionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')

  useEffect(() => {
    fetchDeletionRequests()
  }, [])

  const fetchDeletionRequests = async () => {
    try {
      setLoading(true)
      
      // Fetch deletion requests with related inquiry data
      const { data, error } = await supabase
        .from('deletion_requests')
        .select(`
          *,
          inquiry:inquiries(name, email, subject, message, travel_dates, created_at)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Fetch requester emails
      const requestsWithEmails = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', request.requested_by)
            .single()
          
          return {
            ...request,
            requester: profile || { email: 'Unknown' }
          }
        })
      )
      
      setRequests(requestsWithEmails)
    } catch (error) {
      console.error('Error fetching deletion requests:', error)
      alert('Failed to fetch deletion requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string, inquiryId: string) => {
    if (!confirm('Are you sure you want to approve this deletion? The inquiry will be permanently deleted.')) {
      return
    }

    setProcessing(requestId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update the deletion request status
      const { error: updateError } = await supabase
        .from('deletion_requests')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (updateError) throw updateError

      // Delete the inquiry
      const { error: deleteError } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', inquiryId)

      if (deleteError) throw deleteError

      alert('Deletion request approved and inquiry deleted successfully!')
      await fetchDeletionRequests()
    } catch (error: any) {
      console.error('Error approving deletion:', error)
      alert(`Failed to approve deletion: ${error.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (requestId: string) => {
    const reason = prompt('Please provide a reason for rejecting this deletion request:')
    if (!reason) return

    setProcessing(requestId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('deletion_requests')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          reason: reason // Update reason with rejection reason
        })
        .eq('id', requestId)

      if (error) throw error

      alert('Deletion request rejected successfully!')
      await fetchDeletionRequests()
    } catch (error: any) {
      console.error('Error rejecting deletion:', error)
      alert(`Failed to reject deletion: ${error.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter)

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }

  return (
    <AdminDashboardLayout currentPage="deletion-requests">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Deletion Requests</h1>
          <p className="text-muted-foreground">Review and approve staff deletion requests for past-date inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </Button>
          <Button 
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            Approved ({stats.approved})
          </Button>
          <Button 
            variant={filter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({stats.rejected})
          </Button>
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </Button>
        </div>

        {/* Deletion Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Deletion Requests</CardTitle>
            <CardDescription>
              {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Trash2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No deletion requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(request.status)}
                            <span className="text-sm text-muted-foreground">
                              Requested {new Date(request.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg">
                            {request.inquiry?.subject || 'Unknown Subject'}
                          </h3>
                        </div>
                      </div>

                      {/* Inquiry Details */}
                      {request.inquiry && (
                        <div className="bg-muted/50 rounded-lg p-4 mb-4 space-y-3">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Inquiry Details
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Client Name</p>
                              <p className="font-medium">{request.inquiry.name}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Email</p>
                              <p className="font-medium">{request.inquiry.email}</p>
                            </div>
                            {request.inquiry.travel_dates && (
                              <div>
                                <p className="text-muted-foreground">Travel Dates</p>
                                <p className="font-medium">{request.inquiry.travel_dates}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-muted-foreground">Created</p>
                              <p className="font-medium">
                                {new Date(request.inquiry.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Message</p>
                            <p className="text-sm">{request.inquiry.message.substring(0, 200)}...</p>
                          </div>
                        </div>
                      )}

                      {/* Deletion Request Info */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Requested by</p>
                            <p className="font-medium">{request.requester?.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Reason</p>
                            <p className="font-medium">{request.reason}</p>
                          </div>
                        </div>

                        {request.reviewed_at && (
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Reviewed</p>
                              <p className="font-medium">
                                {new Date(request.reviewed_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons (only for pending requests) */}
                      {request.status === 'pending' && (
                        <div className="flex gap-3 mt-4 pt-4 border-t">
                          <Button
                            onClick={() => handleApprove(request.id, request.inquiry_id)}
                            disabled={processing === request.id}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {processing === request.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve & Delete
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleReject(request.id)}
                            disabled={processing === request.id}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {request.status === 'approved' && (
                        <Alert className="mt-4 bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            This deletion request was approved and the inquiry has been deleted.
                          </AlertDescription>
                        </Alert>
                      )}

                      {request.status === 'rejected' && (
                        <Alert className="mt-4 bg-red-50 border-red-200">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            This deletion request was rejected.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
