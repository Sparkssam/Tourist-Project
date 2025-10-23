"use client"

import { useState, useEffect } from "react"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

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

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchInquiries()
    fetchProfiles()
  }, [])

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInquiries(data || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      showAlert('error', 'Failed to load inquiries')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .in('role', ['staff', 'admin'])

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    }
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', inquiryId)

      if (error) throw error

      setInquiries(inquiries.map(inq => 
        inq.id === inquiryId ? { ...inq, status: newStatus as any } : inq
      ))
      
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as any })
      }

      showAlert('success', 'Status updated successfully!')
    } catch (error) {
      console.error('Error updating status:', error)
      showAlert('error', 'Failed to update status')
    }
  }

  const reassignInquiry = async (inquiryId: string, staffId: string | null) => {
    try {
      const updateData: any = {
        assigned_staff_id: staffId
      }

      if (staffId) {
        updateData.assigned_at = new Date().toISOString()
        if (selectedInquiry?.status === 'new') {
          updateData.status = 'in_progress'
        }
      } else {
        updateData.assigned_at = null
        updateData.status = 'new'
      }

      const { error } = await supabase
        .from('inquiries')
        .update(updateData)
        .eq('id', inquiryId)

      if (error) throw error

      // Update local state
      const updatedInquiry = {
        ...inquiries.find(inq => inq.id === inquiryId)!,
        ...updateData
      }

      setInquiries(inquiries.map(inq => 
        inq.id === inquiryId ? updatedInquiry : inq
      ))
      
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(updatedInquiry)
      }

      showAlert('success', staffId ? 'Inquiry assigned successfully!' : 'Inquiry unassigned successfully!')
    } catch (error) {
      console.error('Error reassigning inquiry:', error)
      showAlert('error', 'Failed to reassign inquiry')
    }
  }

  const deleteInquiry = async (inquiryId: string) => {
    const confirmDelete = confirm('Are you sure you want to permanently delete this inquiry? This action cannot be undone.')
    if (!confirmDelete) return

    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', inquiryId)

      if (error) throw error

      // Remove from local state
      setInquiries(inquiries.filter(inq => inq.id !== inquiryId))
      
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(null)
      }

      showAlert('success', 'Inquiry deleted successfully!')
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      showAlert('error', 'Failed to delete inquiry')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-500"><Clock className="h-3 w-3 mr-1" />New</Badge>
      case 'in_progress':
        return <Badge variant="default" className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" />In Progress</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStaffName = (staffId?: string) => {
    if (!staffId) return 'Unassigned'
    const staff = profiles.find(p => p.id === staffId)
    return staff ? staff.full_name || staff.email : `Staff (${staffId.substring(0, 8)}...)`
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    inProgress: inquiries.filter(i => i.status === 'in_progress').length,
    completed: inquiries.filter(i => i.status === 'completed').length,
    assigned: inquiries.filter(i => i.assigned_staff_id).length,
    unassigned: inquiries.filter(i => !i.assigned_staff_id).length,
  }

  return (
    <AdminDashboardLayout currentPage="inquiries">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tourist Inquiries</h1>
          <p className="text-muted-foreground">
            Manage and respond to tourist safari inquiries
          </p>
        </div>

        {/* Alert Messages */}
        {alert && (
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assigned}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unassigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.unassigned}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Inquiries</CardTitle>
              <CardDescription>Select an inquiry to view details</CardDescription>
              <div className="space-y-2 pt-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
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
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No inquiries found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedInquiry?.id === inquiry.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm">{inquiry.name}</h4>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{inquiry.subject}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </span>
                          {inquiry.assigned_staff_id && (
                            <Badge variant="outline" className="text-xs">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Assigned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inquiry Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Inquiry Details</CardTitle>
              <CardDescription>View and manage inquiry</CardDescription>
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
                            {getStaffName(selectedInquiry.assigned_staff_id)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Assigned {selectedInquiry.assigned_at ? new Date(selectedInquiry.assigned_at).toLocaleString() : 'recently'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reassign to Staff */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Assign to Staff</h4>
                    <Select
                      value={selectedInquiry.assigned_staff_id || "unassigned"}
                      onValueChange={(value) => reassignInquiry(selectedInquiry.id, value === "unassigned" ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {profiles.map(profile => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.full_name || profile.email} ({profile.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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

                  {/* Delete Inquiry */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-destructive flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Danger Zone
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Permanently delete this inquiry. This action cannot be undone.
                    </p>
                    <Button
                      onClick={() => deleteInquiry(selectedInquiry.id)}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Inquiry
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}