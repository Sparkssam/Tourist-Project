"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const DollarSignIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export default function InquiryPage() {
  const searchParams = useSearchParams()
  const [inquiryData, setInquiryData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        const parsed = JSON.parse(data)
        setInquiryData(parsed)
      } catch (error) {
        console.error("Error parsing inquiry data:", error)
      }
    }
  }, [searchParams.get("data")]) // Use the actual parameter value instead of the searchParams object

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare inquiry data for database
      const inquiryToSubmit = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: `Tour Inquiry: ${inquiryData.tourTitle}`,
        message: `Tour: ${inquiryData.tourTitle}
Start Date: ${new Date(inquiryData.startDate).toLocaleDateString()}
End Date: ${new Date(inquiryData.endDate).toLocaleDateString()}
Duration: ${inquiryData.numberOfDays} days
Adults: ${inquiryData.adults}
Children: ${inquiryData.children}
Total Price: $${inquiryData.totalPrice.toLocaleString()}

Additional Message:
${formData.message || 'No additional message'}`,
        travel_dates: `${inquiryData.startDate} to ${inquiryData.endDate}`,
        adults: inquiryData.adults,
        children: inquiryData.children,
        status: 'new'
      }

      const { error: insertError } = await supabase
        .from('inquiries')
        .insert(inquiryToSubmit)

      if (insertError) {
        throw insertError
      }

      setSuccess(true)
      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
      
      // Show success message
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err: any) {
      console.error("Error submitting inquiry:", err)
      setError(err.message || "Failed to submit inquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!inquiryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Tour Inquiry</h1>
          <p className="text-muted-foreground">No tour data found. Please go back and select a tour.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Tour Inquiry</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tour Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon />
                Tour Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{inquiryData.tourTitle}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Start Date</Label>
                  <p className="text-muted-foreground">{new Date(inquiryData.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="font-medium">End Date</Label>
                  <p className="text-muted-foreground">{new Date(inquiryData.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Duration</Label>
                  <p className="text-muted-foreground">{inquiryData.numberOfDays} days</p>
                </div>
                <div>
                  <Label className="font-medium">Travelers</Label>
                  <p className="text-muted-foreground">
                    {inquiryData.adults} adults, {inquiryData.children} children
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSignIcon />
                  <Label className="font-semibold">Total Price</Label>
                </div>
                <p className="text-2xl font-bold text-primary">${inquiryData.totalPrice.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    ✓ Thank you for your inquiry! We will contact you soon.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mb-4 bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Any special requests or questions about your tour..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
