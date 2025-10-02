"use client"

import { useState } from "react"
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
  Clock
} from "lucide-react"
import { TouristInquiry } from "@/lib/types/user"

// Mock inquiry data
const mockInquiries: TouristInquiry[] = [
  {
    id: "1",
    userId: "101",
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 555 123 4567"
    },
    tourType: "Serengeti Safari",
    numberOfPeople: 4,
    preferredDate: new Date("2024-11-15"),
    budget: 5000,
    specialRequests: "Would like to see the Big Five, vegetarian meals required",
    status: "new",
    createdAt: new Date("2024-09-30"),
    updatedAt: new Date("2024-09-30")
  },
  {
    id: "2",
    userId: "102",
    user: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@email.com",
      phone: "+44 20 7946 0958"
    },
    tourType: "Kilimanjaro Trek",
    numberOfPeople: 2,
    preferredDate: new Date("2024-12-01"),
    budget: 3500,
    specialRequests: "Need guide who speaks German",
    status: "in_progress",
    assignedStaffId: "staff1",
    createdAt: new Date("2024-09-28"),
    updatedAt: new Date("2024-09-29"),
    notes: "Contacted client, waiting for final confirmation on dates"
  },
  {
    id: "3",
    userId: "103",
    user: {
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike.wilson@email.com",
      phone: "+61 2 9374 4000"
    },
    tourType: "Cultural Village Tour",
    numberOfPeople: 6,
    preferredDate: new Date("2024-10-20"),
    budget: 2000,
    status: "responded",
    assignedStaffId: "staff1",
    createdAt: new Date("2024-09-25"),
    updatedAt: new Date("2024-09-26"),
    notes: "Sent detailed itinerary and pricing"
  }
]

export function TouristInquiriesList() {
  const [inquiries, setInquiries] = useState<TouristInquiry[]>(mockInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState<TouristInquiry | null>(null)
  const [response, setResponse] = useState('')

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Recent Tourist Inquiries</span>
        </CardTitle>
        <CardDescription>
          Manage and respond to tourist inquiries and requests
        </CardDescription>
      </CardHeader>
      <CardContent>
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