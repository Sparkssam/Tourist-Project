"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, Users, FileText, Star, Eye } from "lucide-react"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Format date helper (replace date-fns)
const formatDate = (dateString: string, includeTime = false) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('en-US', options)
}

interface Profile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  role: string | null
  status: string | null
  created_at: string
}

interface AuthUser {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
}

interface Inquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
}

interface Review {
  id: string
  name: string
  email: string
  rating: number
  comment: string
  status: string
  created_at: string
}

export function DatabaseViewer() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchData = async () => {
    try {
      setRefreshing(true)

      // Fetch profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch auth users (requires service role)
      const { data: authData } = await supabase.auth.admin.listUsers()

      // Fetch inquiries
      const { data: inquiriesData } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      setProfiles(profilesData || [])
      // Map auth users to match our interface
      const mappedAuthUsers = (authData?.users || []).map(user => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at || null,
        email_confirmed_at: user.email_confirmed_at || null
      }))
      setAuthUsers(mappedAuthUsers)
      setInquiries(inquiriesData || [])
      setReviews(reviewsData || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getRoleBadge = (role: string | null) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800',
      staff: 'bg-blue-100 text-blue-800',
      tourist: 'bg-green-100 text-green-800'
    }
    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
        {role || 'No Role'}
      </Badge>
    )
  }

  const getStatusBadge = (status: string | null) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status || 'Unknown'}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading database data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Viewer</h2>
          <p className="text-muted-foreground">
            Last updated: {formatDate(lastUpdated.toISOString(), true)}
          </p>
        </div>
        <Button onClick={fetchData} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profiles" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Profiles ({profiles.length})</span>
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Auth Users ({authUsers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Inquiries ({inquiries.length})</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Reviews ({reviews.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <Card>
            <CardHeader>
              <CardTitle>User Profiles</CardTitle>
              <CardDescription>All user profiles with roles and details</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        {profile.first_name && profile.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : 'Not set'
                        }
                      </TableCell>
                      <TableCell>{profile.email || 'Not set'}</TableCell>
                      <TableCell>{profile.phone || 'Not set'}</TableCell>
                      <TableCell>{getRoleBadge(profile.role)}</TableCell>
                      <TableCell>{getStatusBadge(profile.status)}</TableCell>
                      <TableCell>
                        {formatDate(profile.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Users</CardTitle>
              <CardDescription>Supabase auth users and login information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Email Confirmed</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>User ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={user.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.email_confirmed_at ? 'Confirmed' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.last_sign_in_at 
                          ? formatDate(user.last_sign_in_at, true)
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {user.id.substring(0, 8)}...
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>Customer inquiries and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>{inquiry.name}</TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{inquiry.subject}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell>
                        {formatDate(inquiry.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Customer reviews and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.name}</TableCell>
                      <TableCell>{review.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {review.rating}/5
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        {formatDate(review.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}