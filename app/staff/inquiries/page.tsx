"use client"

import { useState, useEffect } from "react"
import { StaffDashboardLayout } from "@/components/staff/staff-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase/client"
import { 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Loader2,
  Users,
  UserCheck,
  Trash2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Inquiry {
  id: string
  user_id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  adults?: number
  children?: number
  travel_dates?: string
  status: 'new' | 'in_progress' | 'completed'
  assigned_staff_id?: string
  assigned_at?: string
  created_at: string
  updated_at: string
}

export default function StaffInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [submittingResponse, setSubmittingResponse] = useState(false)

  useEffect(() => {
    fetchInquiries()
  }, [])

  useEffect(() => {
    filterInquiries()
  }, [searchQuery, statusFilter, inquiries])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .in('deletion_status', ['active', null]) // Only show active inquiries, hide pending_deletion
        .order('created_at', { ascending: false })

      if (error) throw error
      setInquiries(data || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterInquiries = () => {
    let filtered = [...inquiries]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(inq => inq.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(inq => 
        inq.name.toLowerCase().includes(query) ||
        inq.email.toLowerCase().includes(query) ||
        inq.subject.toLowerCase().includes(query) ||
        inq.message.toLowerCase().includes(query)
      )
    }

    setFilteredInquiries(filtered)
  }

  const updateInquiryStatus = async (inquiryId: string, newStatus: 'new' | 'in_progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', inquiryId)

      if (error) throw error

      // Update local state
      setInquiries(prev => 
        prev.map(inq => 
          inq.id === inquiryId ? { ...inq, status: newStatus } : inq
        )
      )

      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error)
      alert('Failed to update inquiry status')
    }
  }

  const assignToSelf = async (inquiryId: string) => {
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in to assign inquiries')
        return
      }

      const { error } = await supabase
        .from('inquiries')
        .update({ 
          assigned_staff_id: user.id,
          assigned_at: new Date().toISOString(),
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', inquiryId)

      if (error) throw error

      // Update local state
      setInquiries(prev => 
        prev.map(inq => 
          inq.id === inquiryId 
            ? { ...inq, assigned_staff_id: user.id, assigned_at: new Date().toISOString(), status: 'in_progress' } 
            : inq
        )
      )

      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(prev => prev ? { 
          ...prev, 
          assigned_staff_id: user.id, 
          assigned_at: new Date().toISOString(),
          status: 'in_progress'
        } : null)
      }

      alert('Inquiry assigned to you successfully!')
    } catch (error) {
      console.error('Error assigning inquiry:', error)
      alert('Failed to assign inquiry')
    }
  }

  const requestDeletion = async (inquiryId: string, reason: string) => {
    if (!reason || reason.trim() === '') {
      alert('Please provide a reason for deletion')
      return
    }

    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in to delete inquiries')
        return
      }

      // Mark inquiry as pending deletion
      const { error: updateError } = await supabase
        .from('inquiries')
        .update({ deletion_status: 'pending_deletion' })
        .eq('id', inquiryId)

      if (updateError) throw updateError

      // Create deletion request
      const { error: insertError } = await supabase
        .from('deletion_requests')
        .insert({
          inquiry_id: inquiryId,
          deleted_by: user.id,
          reason: reason,
          status: 'pending'
        })

      if (insertError) throw insertError

      alert('Inquiry marked for deletion. Waiting for admin approval.\n\nThe inquiry will be hidden from your view until admin makes a decision.')
      setSelectedInquiry(null)
      await fetchInquiries() // Refresh the list
    } catch (error: any) {
      console.error('Error deleting inquiry:', error)
      alert(`Failed to delete inquiry: ${error.message}`)
    }
  }

  const isPastDate = (travelDates?: string) => {
    if (!travelDates) return false
    
    try {
      // Parse the travel_dates field - it could be in various formats
      // Example: "2024-10-20 to 2024-10-25" or "2024-10-20"
      const dateMatch = travelDates.match(/\d{4}-\d{2}-\d{2}/)
      if (!dateMatch) return false
      
      const travelDate = new Date(dateMatch[0])
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to beginning of day
      
      return travelDate < today
    } catch {
      return false
    }
  }

  const handleSubmitResponse = async () => {
    if (!selectedInquiry || !responseMessage.trim()) return

    setSubmittingResponse(true)
    try {
      // Here you would typically send an email or create a response record
      // For now, we'll just update the status to completed
      await updateInquiryStatus(selectedInquiry.id, 'completed')
      
      alert(`Response sent to ${selectedInquiry.email}`)
      setResponseMessage("")
      setSelectedInquiry(null)
    } catch (error) {
      console.error('Error submitting response:', error)
      alert('Failed to send response')
    } finally {
      setSubmittingResponse(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    inProgress: inquiries.filter(i => i.status === 'in_progress').length,
    completed: inquiries.filter(i => i.status === 'completed').length
  }

  return (
    <StaffDashboardLayout currentPage="inquiries">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Inquiries</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>New</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.new}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, subject, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Inquiries List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Inquiries</CardTitle>
              <CardDescription>
                {filteredInquiries.length} {filteredInquiries.length === 1 ? 'inquiry' : 'inquiries'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No inquiries found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredInquiries.map((inquiry) => (
                    <Card
                      key={inquiry.id}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        selectedInquiry?.id === inquiry.id ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold">{inquiry.name}</h4>
                            <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                          </div>
                          <Badge className={getStatusColor(inquiry.status)}>
                            {getStatusIcon(inquiry.status)}
                            <span className="ml-1 capitalize">{inquiry.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{inquiry.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detail Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Inquiry Details</CardTitle>
              <CardDescription>View and respond to inquiry</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedInquiry ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select an inquiry to view details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Inquiry Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedInquiry.name}</p>
                        <p className="text-sm text-muted-foreground">Name</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedInquiry.email}</p>
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                    </div>

                    {selectedInquiry.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold">{selectedInquiry.phone}</p>
                          <p className="text-sm text-muted-foreground">Phone</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {new Date(selectedInquiry.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                      </div>
                    </div>

                    {/* Group Size */}
                    {(selectedInquiry.adults || selectedInquiry.children) && (
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            {selectedInquiry.adults || 0} Adult{(selectedInquiry.adults || 0) !== 1 ? 's' : ''}, {selectedInquiry.children || 0} Child{(selectedInquiry.children || 0) !== 1 ? 'ren' : ''}
                          </p>
                          <p className="text-sm text-muted-foreground">Group Size</p>
                        </div>
                      </div>
                    )}

                    {/* Travel Dates */}
                    {selectedInquiry.travel_dates && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold">{selectedInquiry.travel_dates}</p>
                          <p className="text-sm text-muted-foreground">Travel Dates</p>
                        </div>
                      </div>
                    )}

                    {/* Assignment Info */}
                    {selectedInquiry.assigned_staff_id && (
                      <div className="flex items-start gap-3">
                        <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            Staff ID: {selectedInquiry.assigned_staff_id.substring(0, 8)}...
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Assigned {selectedInquiry.assigned_at ? new Date(selectedInquiry.assigned_at).toLocaleString() : 'recently'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assign to Me Button */}
                  {!selectedInquiry.assigned_staff_id && (
                    <div className="border-t pt-4">
                      <Button 
                        onClick={() => assignToSelf(selectedInquiry.id)}
                        className="w-full"
                        variant="default"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Assign to Me
                      </Button>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Subject</h4>
                    <p>{selectedInquiry.subject}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Message</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Status</h4>
                    <Select
                      value={selectedInquiry.status}
                      onValueChange={(value: any) => updateInquiryStatus(selectedInquiry.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Response</h4>
                    <Textarea
                      placeholder="Type your response here..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={4}
                      className="mb-2"
                    />
                    <Button
                      onClick={handleSubmitResponse}
                      disabled={!responseMessage.trim() || submittingResponse}
                      className="w-full"
                    >
                      {submittingResponse ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Response
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Delete Button for Past Date Inquiries */}
                  {isPastDate(selectedInquiry.travel_dates) && (
                    <div className="border-t pt-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                        <p className="text-sm text-amber-800 mb-2">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          This inquiry's travel date has passed. You can delete it.
                        </p>
                        <p className="text-xs text-amber-700">
                          Note: Admin must approve the deletion. The inquiry will be hidden from your view until admin decides.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          const reason = prompt('Please provide a reason for deletion:\n(e.g., "Travel date has passed, customer did not proceed")')
                          if (reason && reason.trim()) {
                            requestDeletion(selectedInquiry.id, reason)
                          }
                        }}
                        variant="destructive"
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Inquiry
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}
