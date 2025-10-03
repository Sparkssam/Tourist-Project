"use client"

import { useState, useEffect } from "react"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"
import { 
  Star, 
  Mail, 
  MapPin, 
  Calendar, 
  User,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Loader2,
  Trash2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Review {
  id: string
  user_id: string | null
  name: string
  email: string
  location: string | null
  tour: string | null
  rating: number
  review: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  approved_at: string | null
  approved_by: string | null
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [searchQuery, statusFilter, ratingFilter, reviews])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = () => {
    let filtered = [...reviews]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(review => review.status === statusFilter)
    }

    // Filter by rating
    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(review => 
        review.name.toLowerCase().includes(query) ||
        review.email.toLowerCase().includes(query) ||
        review.review.toLowerCase().includes(query) ||
        review.location?.toLowerCase().includes(query) ||
        review.tour?.toLowerCase().includes(query)
      )
    }

    setFilteredReviews(filtered)
  }

  const updateReviewStatus = async (reviewId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setActionLoading(true)
    try {
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // If approving, set approved_at and approved_by
      if (newStatus === 'approved') {
        updates.approved_at = new Date().toISOString()
        // Note: You might want to get the current admin's ID from auth context
        // updates.approved_by = currentAdminId
      }

      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)

      if (error) throw error

      // Update local state
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId ? { ...review, ...updates } : review
        )
      )

      if (selectedReview?.id === reviewId) {
        setSelectedReview(prev => prev ? { ...prev, ...updates } : null)
      }

      // Show success message
      const statusText = newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'set to pending'
      alert(`Review ${statusText} successfully!`)
    } catch (error) {
      console.error('Error updating review status:', error)
      alert('Failed to update review status')
    } finally {
      setActionLoading(false)
    }
  }

  const deleteReview = async (reviewId: string) => {
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)

      if (error) throw error

      // Update local state
      setReviews(prev => prev.filter(review => review.id !== reviewId))
      
      if (selectedReview?.id === reviewId) {
        setSelectedReview(null)
      }

      setDeleteReviewId(null)
      alert('Review deleted successfully!')
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'
  }

  return (
    <AdminDashboardLayout currentPage="overview">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Review Management</h1>
          <p className="text-muted-foreground">
            Moderate and manage tourist reviews and testimonials
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Reviews</CardDescription>
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
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Rating</CardDescription>
              <CardTitle className="text-3xl flex items-center">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 mr-1" />
                {stats.avgRating}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, review, location, or tour..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Star className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Reviews List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No reviews found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredReviews.map((review) => (
                    <Card
                      key={review.id}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        selectedReview?.id === review.id ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => setSelectedReview(review)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold">{review.name}</h4>
                            <p className="text-sm text-muted-foreground">{review.email}</p>
                          </div>
                          <Badge className={getStatusColor(review.status)}>
                            {getStatusIcon(review.status)}
                            <span className="ml-1 capitalize">{review.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">
                            ({review.rating}/5)
                          </span>
                        </div>
                        {review.tour && (
                          <p className="text-sm font-medium mb-1">Tour: {review.tour}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">{review.review}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {new Date(review.created_at).toLocaleDateString()}
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
              <CardTitle>Review Details</CardTitle>
              <CardDescription>View and moderate review</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedReview ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a review to view details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Reviewer Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedReview.name}</p>
                        <p className="text-sm text-muted-foreground">Reviewer Name</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedReview.email}</p>
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                    </div>

                    {selectedReview.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold">{selectedReview.location}</p>
                          <p className="text-sm text-muted-foreground">Location</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {new Date(selectedReview.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                      </div>
                    </div>
                  </div>

                  {selectedReview.tour && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Tour</h4>
                      <p>{selectedReview.tour}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Rating</h4>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedReview.rating)}
                      <span className="text-lg font-semibold">
                        {selectedReview.rating}/5
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Review</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedReview.review}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Status</h4>
                    <Badge className={getStatusColor(selectedReview.status)} variant="outline">
                      {getStatusIcon(selectedReview.status)}
                      <span className="ml-1 capitalize">{selectedReview.status}</span>
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4 space-y-2">
                    <h4 className="font-semibold mb-3">Actions</h4>
                    
                    {selectedReview.status !== 'approved' && (
                      <Button
                        onClick={() => updateReviewStatus(selectedReview.id, 'approved')}
                        disabled={actionLoading}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Review
                          </>
                        )}
                      </Button>
                    )}

                    {selectedReview.status !== 'rejected' && (
                      <Button
                        onClick={() => updateReviewStatus(selectedReview.id, 'rejected')}
                        disabled={actionLoading}
                        variant="outline"
                        className="w-full"
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Review
                          </>
                        )}
                      </Button>
                    )}

                    {selectedReview.status !== 'pending' && (
                      <Button
                        onClick={() => updateReviewStatus(selectedReview.id, 'pending')}
                        disabled={actionLoading}
                        variant="outline"
                        className="w-full"
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            Set to Pending
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      onClick={() => setDeleteReviewId(selectedReview.id)}
                      disabled={actionLoading}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Review
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteReviewId} onOpenChange={() => setDeleteReviewId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Review</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this review? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteReviewId && deleteReview(deleteReviewId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminDashboardLayout>
  )
}
