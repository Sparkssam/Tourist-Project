"use client"

import { useState, type FormEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MessageSquare } from "lucide-react"

interface TourInquiryFormProps {
  tourName: string
}

export function TourInquiryForm({ tourName }: TourInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "",
    dates: "",
    travelers: "",
    specialRequests: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const payload = { ...formData, tourName }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || res.statusText || "Failed to send enquiry")
      }

      setSuccess(true)
      setFormData({ name: "", email: "", phone: "", preferredContact: "", dates: "", travelers: "", specialRequests: "" })
    } catch (err: any) {
      setError(err?.message || "Unexpected error sending enquiry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-luxury text-primary">Send Your Enquiry</CardTitle>
            <p className="text-muted-foreground">
              Get a personalized quote for "{tourName}" and let us help plan your perfect safari adventure.
            </p>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-green-800">
                <h3 className="font-semibold text-lg mb-2">Enquiry Received!</h3>
                <p>Thanks — we've received your enquiry for "{tourName}". We'll be in touch within 24 hours.</p>
              </div>
            ) : (
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
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
                  <Select
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Travel Dates</label>
                  <Input
                    value={formData.dates}
                    onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                    placeholder="e.g., March 2024 or flexible"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Travelers</label>
                  <Select
                    value={formData.travelers}
                    onValueChange={(value) => setFormData({ ...formData, travelers: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3-4">3-4 People</SelectItem>
                      <SelectItem value="5-8">5-8 People</SelectItem>
                      <SelectItem value="8+">8+ People</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Enquiry
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Call +255760309999
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
