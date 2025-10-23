"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MessageSquare, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface TourInquiryFormProps {
  tourName: string
}

export function TourInquiryForm({ tourName }: TourInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "",
    travelDates: "",
    adults: "2",
    children: "0",
    specialRequests: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const { supabase } = await import('@/lib/supabase/client')
      
      const inquiryData = {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        tour_type: tourName,
        travel_dates: formData.travelDates || null,
        adults: parseInt(formData.adults) || 2,
        children: parseInt(formData.children) || 0,
        message: formData.specialRequests ? 
          `Preferred Contact: ${formData.preferredContact}\n\n${formData.specialRequests}` : 
          `Preferred Contact: ${formData.preferredContact}`,
        status: 'new',
        source: 'tour_inquiry_form'
      }

      const { error: dbError } = await supabase
        .from('inquiries')
        .insert(inquiryData)

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Failed to submit inquiry. Please try again.')
      }

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredContact: "",
        travelDates: "",
        adults: "2",
        children: "0",
        specialRequests: "",
      })

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)

    } catch (err: any) {
      console.error('Error submitting inquiry:', err)
      setError(err.message || 'Failed to submit inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-luxury text-primary">Inquire About This Tour</CardTitle>
            <p className="text-muted-foreground">
              Get a personalized quote for "{tourName}" and let us help plan your perfect safari adventure.
            </p>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-6 border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for your inquiry! Our team will contact you within 24 hours.
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+255 XXX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Travel Dates</label>
                  <Input
                    type="date"
                    value={formData.travelDates}
                    onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Select travel date"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Contact Method *</label>
                  <Select
                    required
                    value={formData.preferredContact}
                    onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Adults *</label>
                  <Input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                    placeholder="Number of adults"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Children</label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    placeholder="Number of children"
                  />
                </div>
                <div>
                  {/* Empty div for grid alignment */}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requests or Questions</label>
                <Textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Any dietary requirements, accessibility needs, or specific interests..."
                  rows={4}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                  <a href="tel:+255760309999">
                    <Phone className="h-4 w-4 mr-2" />
                    Call +255760309999
                  </a>
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                  <a href="https://wa.me/255760309999" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
