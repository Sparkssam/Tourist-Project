"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MessageSquare, 
  User, 
  Calendar, 
  DollarSign, 
  Users,
  Phone,
  Mail,
  MoreHorizontal,
  Eye,
  MessageCircle,
  CheckCircle,
  Clock,
  Loader2,
  Inbox
} from "lucide-react"
import { TouristInquiry } from "@/lib/types/user"
import { supabase } from "@/lib/supabase/client"

export function TouristInquiriesList() {
  const [inquiries, setInquiries] = useState<TouristInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<TouristInquiry | null>(null)
  const [response, setResponse] = useState('')

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      
      // Fetch inquiries from Supabase
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching inquiries:', error)
        return
      }

      // Transform data to match TouristInquiry interface
      const transformedInquiries: TouristInquiry[] = (data || []).map((inquiry: any) => ({
        id: inquiry.id,
        userId: inquiry.user_id,
        user: {
          firstName: inquiry.profiles?.first_name || 'Unknown',
          lastName: inquiry.profiles?.last_name || 'User',
          email: inquiry.profiles?.email || '',
          phone: inquiry.profiles?.phone || ''
        },
        tourType: inquiry.tour_type || inquiry.tour_name || 'General Inquiry',
        numberOfPeople: inquiry.number_of_people || inquiry.guests || 1,
        preferredDate: inquiry.preferred_date ? new Date(inquiry.preferred_date) : new Date(),
        budget: inquiry.budget || 0,
        specialRequests: inquiry.special_requests || inquiry.message || '',
        status: inquiry.status || 'new',
        assignedStaffId: inquiry.assigned_staff_id,
        createdAt: new Date(inquiry.created_at),
        updatedAt: new Date(inquiry.updated_at || inquiry.created_at),
        notes: inquiry.notes || ''
      }))

      setInquiries(transformedInquiries)
    } catch (error) {
      console.error('Error loading inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: TouristInquiry['status']) => {
    switch (status) {
      case 'new':
        return "bg-red-100 text-red-800"
      case 'in_progress':
        return "bg-yellow-100 text-yellow-800"
      case 'responded':
        return "bg-blue-100 text-blue-800"
      case 'completed':
        return "bg-green-100 text-green-800"
      case 'cancelled':
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: TouristInquiry['status']) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <MessageCircle className="h-4 w-4" />
      case 'responded':
        return <MessageSquare className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const updateInquiryStatus = (inquiryId: string, newStatus: TouristInquiry['status']) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, status: newStatus, updatedAt: new Date() }
          : inquiry
      )
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Loading inquiries...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Tourist Inquiries</span>
          {inquiries.length > 0 && (
            <Badge variant="secondary">{inquiries.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Manage and respond to tourist inquiries and requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Inquiries Yet</h3>
            <p className="text-sm text-muted-foreground">
              Tourist inquiries will appear here when they are submitted through the website.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className={getStatusBadgeVariant(inquiry.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(inquiry.status)}
                          <span className="capitalize">{inquiry.status.replace('_', ' ')}</span>
                        </span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {inquiry.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedInquiry(inquiry)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateInquiryStatus(inquiry.id, 'in_progress')}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateInquiryStatus(inquiry.id, 'completed')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Tourist Info */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {inquiry.user.firstName} {inquiry.user.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{inquiry.user.email}</span>
                    </div>
                    {inquiry.user.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{inquiry.user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Tour Details */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{inquiry.tourType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{inquiry.numberOfPeople} people</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{inquiry.preferredDate.toLocaleDateString()}</span>
                    </div>
                    {inquiry.budget && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">${inquiry.budget}</span>
                      </div>
                    )}
                  </div>

                  {/* Special Requests */}
                  {inquiry.specialRequests && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Special Requests:</strong> {inquiry.specialRequests}
                    </div>
                  )}

                  {/* Notes */}
                  {inquiry.notes && (
                    <div className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-200">
                      <strong>Staff Notes:</strong> {inquiry.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Inquiry Details Dialog */}
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
              <DialogDescription>
                Full details and response options for this inquiry
              </DialogDescription>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-4">
                {/* Tourist Information */}
                <div className="space-y-2">
                  <h4 className="font-medium">Tourist Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span> {selectedInquiry.user.firstName} {selectedInquiry.user.lastName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span> {selectedInquiry.user.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span> {selectedInquiry.user.phone || 'Not provided'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inquiry Date:</span> {selectedInquiry.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Tour Details */}
                <div className="space-y-2">
                  <h4 className="font-medium">Tour Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tour Type:</span> {selectedInquiry.tourType}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Number of People:</span> {selectedInquiry.numberOfPeople}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Preferred Date:</span> {selectedInquiry.preferredDate.toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Budget:</span> {selectedInquiry.budget ? `$${selectedInquiry.budget}` : 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedInquiry.specialRequests && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Special Requests</h4>
                    <p className="text-sm bg-muted p-3 rounded">
                      {selectedInquiry.specialRequests}
                    </p>
                  </div>
                )}

                {/* Response Section */}
                <div className="space-y-2">
                  <h4 className="font-medium">Add Response/Notes</h4>
                  <Textarea
                    placeholder="Type your response or add notes..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
                      Close
                    </Button>
                    <Button onClick={() => {
                      // TODO: Save response
                      console.log('Saving response:', response)
                      setResponse('')
                      setSelectedInquiry(null)
                    }}>
                      Save Response
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}