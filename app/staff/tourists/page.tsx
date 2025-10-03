"use client"

import { useState, useEffect } from "react"
import { StaffDashboardLayout } from "@/components/staff/staff-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"
import { 
  Mail, 
  Phone, 
  Calendar, 
  User,
  Search,
  Filter,
  Loader2,
  CheckCircle,
  XCircle,
  Users as UsersIcon
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Tourist {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export default function StaffTouristsPage() {
  const [tourists, setTourists] = useState<Tourist[]>([])
  const [filteredTourists, setFilteredTourists] = useState<Tourist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null)

  useEffect(() => {
    fetchTourists()
  }, [])

  useEffect(() => {
    filterTourists()
  }, [searchQuery, statusFilter, tourists])

  const fetchTourists = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'tourist')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTourists(data || [])
    } catch (error) {
      console.error('Error fetching tourists:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTourists = () => {
    let filtered = [...tourists]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(tourist => tourist.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tourist => 
        tourist.email.toLowerCase().includes(query) ||
        tourist.first_name?.toLowerCase().includes(query) ||
        tourist.last_name?.toLowerCase().includes(query) ||
        tourist.phone?.toLowerCase().includes(query)
      )
    }

    setFilteredTourists(filtered)
  }

  const updateTouristStatus = async (touristId: string, newStatus: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', touristId)

      if (error) throw error

      // Update local state
      setTourists(prev => 
        prev.map(tourist => 
          tourist.id === touristId ? { ...tourist, status: newStatus } : tourist
        )
      )

      if (selectedTourist?.id === touristId) {
        setSelectedTourist(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating tourist status:', error)
      alert('Failed to update tourist status')
    }
  }

  const stats = {
    total: tourists.length,
    active: tourists.filter(t => t.status === 'active').length,
    inactive: tourists.filter(t => t.status === 'inactive').length
  }

  return (
    <StaffDashboardLayout currentPage="tourists">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Tourists</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Inactive</CardDescription>
              <CardTitle className="text-3xl text-gray-600">{stats.inactive}</CardTitle>
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
                  placeholder="Search by name, email, or phone..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Tourists Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Registered Tourists</CardTitle>
              <CardDescription>
                {filteredTourists.length} {filteredTourists.length === 1 ? 'tourist' : 'tourists'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTourists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UsersIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tourists found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTourists.map((tourist) => (
                        <TableRow
                          key={tourist.id}
                          className={`cursor-pointer hover:bg-accent ${
                            selectedTourist?.id === tourist.id ? 'bg-accent' : ''
                          }`}
                          onClick={() => setSelectedTourist(tourist)}
                        >
                          <TableCell className="font-medium">
                            {tourist.first_name || tourist.last_name ? `${tourist.first_name || ''} ${tourist.last_name || ''}`.trim() : 'N/A'}
                          </TableCell>
                          <TableCell>{tourist.email}</TableCell>
                          <TableCell>{tourist.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                tourist.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {tourist.status === 'active' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {tourist.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(tourist.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTourist(tourist)
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detail Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Tourist Details</CardTitle>
              <CardDescription>View tourist information</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedTourist ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a tourist to view details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Tourist Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {selectedTourist.first_name || selectedTourist.last_name 
                            ? `${selectedTourist.first_name || ''} ${selectedTourist.last_name || ''}`.trim() 
                            : 'Not provided'}
                        </p>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedTourist.email}</p>
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedTourist.phone || 'Not provided'}</p>
                        <p className="text-sm text-muted-foreground">Phone</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {new Date(selectedTourist.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Joined Date</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {new Date(selectedTourist.updated_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Account Status</h4>
                    <Select
                      value={selectedTourist.status}
                      onValueChange={(value: any) => updateTouristStatus(selectedTourist.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Change the account status to activate or deactivate the tourist
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(`mailto:${selectedTourist.email}`)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      {selectedTourist.phone && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => window.open(`tel:${selectedTourist.phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Phone
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}
